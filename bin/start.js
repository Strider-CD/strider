'use strict';

function start(extpath) {
  var common = require('../lib/common');
  var path = require('path');
  var main = require('../main');
  var extpaths = require('../lib/config').extpath.split(':');
  var extdir = [];

  for (var i in extpaths) {
    // Extensions are either in ../node_modules (if local)
    // or __dirname/../
    extdir.push(path.resolve(__dirname + "../" + extpaths[i]));

    try {
      fs.statSync(extdir);
    } catch(e) {
      extdir.pop();
      extdir.push(path.resolve(__dirname + "/../" + extpaths[i]));
    }
  }

  if (extpath){
    extdir.push(path.resolve(extpath));
  }

  // Save extension dir
  common.extdir = extdir;
  main(extdir);
}

module.exports = start;
