'use strict';

var _ = require('lodash');
var JobMonitor = require('./job-monitor');
var SKELS = require('./skels');

function JobDataMonitor() {
 JobMonitor.apply(this, arguments);
}

_.extend(JobDataMonitor.prototype, JobMonitor.prototype, {});

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
  'command.comment': function (data) {
    var phase = this.phases[this.phase]
      , command = _.extend({}, SKELS.command);
    command.command = data.comment;
    command.comment = true;
    command.plugin = data.plugin;
    command.finished = data.time;
    phase.commands.push(command);
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

function ensureCommand(phase) {
  var command = phase.commands[phase.commands.length - 1]
  if (!command || typeof(command.finished) !== 'undefined') {
    command = _.extend({}, SKELS.command)
    phase.commands.push(command)
  }
  return command
}

module.exports = JobDataMonitor;
