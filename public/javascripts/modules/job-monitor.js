
/* global console: true */

var PHASES = ['environment', 'prepare', 'test', 'deploy', 'cleanup'];

// The Job Monitor:
// - update jobs based on browser events
// 

function JobMonitor(socket, changed) {
  this.sock = socket;
  this.changed = changed;
  this.waiting = {};
  this.listen();
}

JobMonitor.prototype = {
  emits: {
    getUnknown: 'dashboard:unknown'
  },
  events: {
    'browser.update': 'update',
    'job.new': function (job, access) {
      this.addJob(job, access);
      this.changed();
    },
    'job.done': function (job, access) {
      this.addJob(job, access);
      this.changed();
    }
  },
  job: function (id, access) {
    throw new Error('You must override this');
  },
  addJob: function (job, access) {
    throw new Error('You must implement');
  },
  listen: function () {
    var handler;
    for (var event in this.events) {
      handler = this.events[event];
      if ('string' === typeof handler) handler = this[handler];
      this.sock.on(event, handler.bind(this));
    }
  },
  // access: 'yours', 'public', 'admin'
  update: function (event, args, access, dontchange) {
    var id = args.shift()
      , job = this.job(id, access)
      , name = event.indexOf('job.status.') === 0 ? event.substr('job.status.'.length) : event
      , handler = this.statuses[name];
    if (!job) return this.unknown(id, event, args, access)
    if (!handler) return;
    if ('string' === typeof handler) {
      job.status = handler;
    } else {
      handler.apply(job, args);
    }
    if (!dontchange) this.changed();
  },
  unknown: function (id, event, args, access) {
    args = [id].concat(args);
    if (this.waiting[id]) {
      return this.waiting.push([event, args, access]);
    }
    this.waiting[id] = [[event, args, access]];
    this.sock.emit(this.emits.getUnknown, id, this.gotUnknown.bind(this));
  },
  gotUnknown: function (job) {
    if (!this.waiting[job._id]) return console.warn("Got unknownjob:response but wan't waiting for it...");
    var access = this.waiting[job._id][0][2];
    this.addJob(job);
    // TODO: this.update searches for the job again. optimize
    for (var i=0; i<this.waiting[job._id]; i++) {
      this.update.apply(this, this.waiting[i].concat([true]));
    }
    delete this.waiting[job._id];
    this.changed();
  },
  statuses: {
    'started': function (time) {
      this.started = time;
      this.phase = 0;
      this.numphases = this.type === 'TEST_ONLY' ? 4 : 5;
      this.status = 'running';
    },
    'errored': 'errored',
    'canceled': 'errored',
    'phase.done': function (data) {
      this.phase = PHASES.indexOf(data.phase) + 1;
    }
  },
};

function ensureCommand(phase) {
  var command = phase.commands[phase.commands.length - 1]
  if (!command || typeof(command.finished) !== 'undefined') {
    command = _.extend({}, SKELS.command)
    phase.commands.push(command)
  }
  return command
}
var SKELS = {
  job: {
    id: null,
    data: null,
    phases: {},
    phase: PHASES[0],
    queued: null,
    started: null,
    finished: null,
    test_status: -1,
    deploy_status: -1,
    std: {
      out: '',
      err: '',
      merged: ''
    }
  },
  command: {
    out: '',
    err: '',
    merged: '',
    started: null,
    command: '',
    plugin: ''
  },
  phase: {
    finished: null,
    exitCode: -1,
    commands: []
  }
}

function JobDataMonitor() {
 JobMonitor.apply(this, arguments);
}

_.extend(JobDataMonitor.prototype, JobMonitor.prototype, {
});

_.extend(JobDataMonitor.prototype.statuses, {
  'phase.done': function (phase, time, code) {
    var next = PHASES[PHASES.indexOf(phase) + 1];
    this.phases[phase].finished = time;
    this.phases[phase].exitCode = code;
    if (phase === 'test') this.test_status = code;
    if (phase === 'deploy') this.deploy_status = code;
    if (!next) return;
    this.phase = next;
  },
  'command.start': function (data) {
    var phase = this.phases[this.phase]
      , command = _.extend(data, SKELS.command);
    phase.commands.push(command);
  },
  'command.done': function (exitCode, time, elapsed) {
    var phase = this.phases[this.phase]
      , command = phase.commands[phase.commands.length - 1];
    command.finished = time;
    command.exitCode = exitCode;
  },
  'stdout': function (text) {
    var command = ensureCommand(this.phases[this.phase]);
    command.out += text;
    command.merged += text;
    this.std.out += text;
    this.std.merged += text;
  },
  'stderr': function (text) {
    var command = ensureCommand(this.phases[this.phase]);
    command.err += text;
    command.merged += text;
    this.std.err += text;
    this.std.merged += text;
  },
})
