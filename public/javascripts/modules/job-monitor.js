
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
    'job.new': function (job, access) {
      this.addJob(job[0], access);
      this.changed();
    },
    'job.done': function (job, access) {
      this.addJob(job[0], access);
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
    for (var status in this.statuses) {
      this.sock.on('job.status.' + status, this.update.bind(this, status))
    }
  },
  // access: 'yours', 'public', 'admin'
  update: function (event, args, access, dontchange) {
    var id = args.shift()
      , job = this.job(id, access)
      , handler = this.statuses[event];
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
      return this.waiting[id].push([event, args, access]);
    }
    this.waiting[id] = [[event, args, access]];
    this.sock.emit(this.emits.getUnknown, id, this.gotUnknown.bind(this));
  },
  gotUnknown: function (job) {
    if (!this.waiting[job._id]) return console.warn("Got unknownjob:response but wan't waiting for it...");
    var access = this.waiting[job._id][0][2];
    if (job.status === 'submitted') {
      job.status = 'running';
      job.started = new Date();
    }
    // job.phase = job.phase || 'environment';
    this.addJob(job, access);
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
      this.phase = 'environment';
      this.status = 'running';
    },
    'errored': function (error) {
      this.error = error;
      this.status = 'errored';
    },
    'canceled': 'errored',
    'phase.done': function (data) {
      this.phase = PHASES.indexOf(data.phase) + 1;
    },
    // this is just so we'll trigger the "unknown job" lookup sooner on the dashboard
    'stdout': function (text) {},
    'stderr': function (text) {},
    'warning': function (warning) {
      if (!this.warnings) {
        this.warnings = [];
      }
      this.warnings.push(warning);
    },
    'plugin-data': function (data) {
      var path = data.path ? [data.plugin].concat(data.path.split('.')) : [data.plugin]
      , last = path.pop()
      , method = data.method || 'replace'
      , parent
      parent = path.reduce(function (obj, attr) {
        return obj[attr] || (obj[attr] = {})
      }, this.plugin_data || (this.plugin_data = {}))
      if (method === 'replace') {
        parent[last] = data.data
      } else if (method === 'push') {
        if (!parent[last]) {
          parent[last] = []
        }
        parent[last].push(data.data)
      } else if (method === 'extend') {
        if (!parent[last]) {
          parent[last] = {}
        }
        _.extend(parent[last], data.data)
      } else {
        console.error('Invalid "plugin data" method received from plugin', data.plugin, data.method, data)
      }
    }
  }
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
    test_status: null,
    deploy_status: null,
    plugin_data: {},
    warnings: [],
    std: {
      out: '',
      err: '',
      merged: '',
      merged_latest: ''
    }
  },
  command: {
    out: '',
    err: '',
    merged: '',
    _merged: '',
    started: null,
    command: '',
    plugin: ''
  },
  phase: {
    finished: null,
    exitCode: null,
    commands: []
  }
}

function JobDataMonitor() {
 JobMonitor.apply(this, arguments);
}

_.extend(JobDataMonitor.prototype, JobMonitor.prototype, {
});

JobDataMonitor.prototype.statuses = _.extend({}, JobMonitor.prototype.statuses, {
  'phase.done': function (data) {
    this.phases[data.phase].finished = data.time;
    this.phases[data.phase].duration = data.elapsed
    this.phases[data.phase].exitCode = data.code;
    if (['prepare', 'environment', 'cleanup'].indexOf(data.phase) !== -1) {
      this.phases[data.phase].collapsed = true;
    }
    if (data.phase === 'test') this.test_status = data.code;
    if (data.phase === 'deploy') this.deploy_status = data.code;
    if (!data.next || !this.phases[data.next]) return;
    this.phase = data.next;
    this.phases[data.next].started = data.time;
  },
  'command.start': function (data) {
    var phase = this.phases[this.phase]
      , command = _.extend({}, SKELS.command, data);
    command.started = data.time;
    phase.commands.push(command);
  },
  'command.done': function (data) {
    var phase = this.phases[this.phase]
      , command = phase.commands[phase.commands.length - 1];
    command.finished = data.time;
    command.duration = data.elapsed;
    command.exitCode = data.exitCode;
    command.merged = command._merged;
  },
  'stdout': function (text) {
    var command = ensureCommand(this.phases[this.phase]);
    command.out += text;
    command._merged += text;
    this.std.out += text;
    this.std.merged += text;
    this.std.merged_latest = text;
  },
  'stderr': function (text) {
    var command = ensureCommand(this.phases[this.phase]);
    command.err += text;
    command._merged += text;
    this.std.err += text;
    this.std.merged += text;
    this.std.merged_latest = text;
  }
})
