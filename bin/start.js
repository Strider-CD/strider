'use strict';

function start(extpath) {
  var common = require('../lib/common');
  var path = require('path');
  var main = require('../main');
  var getPluginPath = require('../lib/plugin_path');
  var extdir = getPluginPath(extpath);
  // Save extension dir
  common.extdir = extdir
  main(extdir);
}

module.exports = start;
