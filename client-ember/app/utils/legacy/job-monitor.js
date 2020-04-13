import { extend } from 'lodash-es';
// import PHASES from './phases';
import SKELS from './skels';

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
    // build:job on build page
    getUnknown: 'dashboard:unknown',
  },
  events: {
    'job.new': function (job, access) {
      this.addJob(job[0], access);
      this.changed();
    },
    'job.done': function (job, access) {
      this.addJob(job[0], access);
      this.changed();
    },
  },
  job: function () {
    throw new Error('You must override this');
  },
  addJob: function () {
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
      this.sock.on(`job.status.${status}`, this.update.bind(this, status));
    }
  },
  // access: 'yours', 'public', 'admin'
  update: function (event, args, access, dontchange) {
    var id = args.shift();
    var job = this.job(id, access);
    var handler = this.statuses[event];
    if (!job) return this.unknown(id, event, args, access);
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
    if (!this.waiting[job._id])
      // eslint-disable-next-line no-console
      return console.warn(
        "Got unknownjob:response but wan't waiting for it..."
      );
    var access = this.waiting[job._id][0][2];
    if (job.status === 'submitted') {
      job.status = 'running';
      job.started = new Date();
    }
    // job.phase = job.phase || 'environment';
    this.addJob(job, access);
    // TODO: this.update searches for the job again. optimize
    for (var i = 0; i < this.waiting[job._id]; i++) {
      this.update.apply(this, this.waiting[i].concat([true]));
    }
    delete this.waiting[job._id];
    this.changed();
  },
  statuses: {
    'phase.done': function (data) {
      this.phases[data.phase].finished = data.time;
      this.phases[data.phase].duration = data.elapsed;
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
    // 'phase.done': function (data) {
    //   this.phase = PHASES.indexOf(data.phase) + 1;
    // },
    'command.comment': function (data) {
      var phase = this.phases[this.phase];
      var command = extend({}, SKELS.command);
      command.command = data.comment;
      command.comment = true;
      command.plugin = data.plugin;
      command.finished = data.time;
      phase.commands.push(command);
    },
    'command.start': function (data) {
      var phase = this.phases[this.phase];
      var command = extend({}, SKELS.command, data);
      command.started = data.time;
      phase.commands.push(command);
    },
    'command.done': function (data) {
      var phase = this.phases[this.phase];
      var command = phase.commands[phase.commands.length - 1];
      command.finished = data.time;
      command.duration = data.elapsed;
      command.exitCode = data.exitCode;
      command.merged = command._merged;
    },
    stdout: function (text) {
      var command = ensureCommand(this.phases[this.phase]);
      command.out += text;
      command._merged += text;
      this.std.out += text;
      this.std.merged += text;
      this.std.merged_latest = text;
    },
    stderr: function (text) {
      var command = ensureCommand(this.phases[this.phase]);
      command.err += text;
      command._merged += text;
      this.std.err += text;
      this.std.merged += text;
      this.std.merged_latest = text;
      debugger;
    },
    started: function (time) {
      this.started = time;
      this.phase = 'environment';
      this.status = 'running';
    },
    errored: function (error) {
      this.error = error;
      this.status = 'errored';
      debugger;
    },
    canceled: 'errored',

    warning: function (warning) {
      if (!this.warnings) {
        this.warnings = [];
      }
      this.warnings.push(warning);
    },
    'plugin-data': function (data) {
      var path = data.path
        ? [data.plugin].concat(data.path.split('.'))
        : [data.plugin];
      var last = path.pop();
      var method = data.method || 'replace';
      var parent;
      parent = path.reduce(function (obj, attr) {
        return obj[attr] || (obj[attr] = {});
      }, this.plugin_data || (this.plugin_data = {}));
      if (method === 'replace') {
        parent[last] = data.data;
      } else if (method === 'push') {
        if (!parent[last]) {
          parent[last] = [];
        }
        parent[last].push(data.data);
      } else if (method === 'extend') {
        if (!parent[last]) {
          parent[last] = {};
        }
        extend(parent[last], data.data);
      } else {
        // eslint-disable-next-line no-console
        console.error(
          'Invalid "plugin data" method received from plugin',
          data.plugin,
          data.method,
          data
        );
      }
    },
  },
};

function ensureCommand(phase) {
  var command = phase.commands[phase.commands.length - 1];
  if (!command || typeof command.finished !== 'undefined') {
    command = extend({}, SKELS.command);
    phase.commands.push(command);
  }
  return command;
}

export default JobMonitor;
