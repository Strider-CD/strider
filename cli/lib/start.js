'use strict';

module.exports = function (deps) {
  var resilient = require('./resilient')(deps);

  return function (extpath, opts) {
    var path = require('path');
    var extdir = deps.getPluginPath()(extpath);
    // Save extension dir
    deps.common().extdir = extdir;

    resilient.spawn(function () {
      deps.main()(extdir);
    }, opts.cluster === false);
  };
};
