'use strict';

var common = require('../lib/common');
var path = require('path');
var main = require('../main');
var getPluginPath = require('../lib/plugin_path');

function start(extpath) {
  var extdir = getPluginPath(extpath);
  // Save extension dir
  common.extdir = extdir
  main(extdir);
}

module.exports = start;
