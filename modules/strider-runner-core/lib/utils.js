'use strict';

const _ = require('lodash');
const shellParse = require('shell-quote').parse;

module.exports = {
  exitError: exitError,
  sum: sum,
  runPlugin: runPlugin,
  normalizeCmd: normalizeCmd
};

function exitError(command, code) {
  var e = new Error(`Command "${command} failed with code: ${code}`);
  e.type = 'exitCode';
  e.code = code;
  return e;
}

function sum(list) {
  return list.reduce(function (a, b) {
    return a + b;
  }, 0);
}

function runPlugin(phase, plugin, context, done) {
  // plugin[phase] is expected to be an object that describes a shell command to run.
  // Not all plugins will provide commands for every phase.
  if (!plugin[phase]) return done();

  // Allow plugins to provide a callback to handle the phase itself.
  if ('function' === typeof plugin[phase]) {
    return plugin[phase](context, done);
  }

  // Allow plugins to provide multiple commands.
  if (Array.isArray(plugin[phase])) {
    return commandRunner(0);
  }

  // Run a single command.
  context.cmd(plugin[phase], function (code) {
    var data = {};
    data[`${phase}Cmd`] = code ? 'failed' : 'passed';
    context.data(data, 'extend');
    done(code && exitError(code), true);
  });

  function commandRunner(commandIndex) {
    if (commandIndex >= plugin[phase].length) return done(null, true);

    context.cmd(plugin[phase][commandIndex], function (code) {
      var data = {};
      data[`${phase}Cmd`] = code ? 'failed' : 'passed';
      context.data(data, 'extend');
      if (code && exitError(code)) {
        done(code && exitError(code), true);
      } else {
        commandRunner(commandIndex + 1);
      }
    });
  }
}

// normalizeCmd('cmd string')
// normalizeCmd({command: 'name', args: [...]})
function normalizeCmd(cmd, options) {
  if (cmd.cmd) {
    options = options || {};
    _.extend(options, cmd);
    cmd = options.cmd;
    delete options.cmd;
  }
  if (typeof(cmd) === 'string') {
    cmd = {
      command: cmd
    };
  }
  if (typeof(cmd.args) === 'undefined') {
    cmd.args = shellParse(cmd.command);
    cmd.command = cmd.args.shift();
  }
  return cmd;
}

