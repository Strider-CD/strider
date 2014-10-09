'use strict';

var PHASES = require('./phases');

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
};

module.exports = SKELS;
