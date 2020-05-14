const _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  rimraf = require('rimraf'),
  install = require('./install_plugin');

module.exports = function (pluginsPath) {
  const local = require('./local_plugins')(pluginsPath);

  /*
   * Callback signature:
   *   cb(Error anyError, Boolean restartOrNot)
   */
  return function (name, cb) {
    local.listAllZipped(function (err, plugins) {
      const plugin = plugins[name];
      if (plugin) {
        rimraf(plugin.path, function (err) {
          console.log('removed ' + plugin.path);
          install(pluginsPath)(name, cb);
        });
      } else {
        console.error(name + ' not found');
        cb();
      }
    });
  };
};

function afterDelete(pluginPath, cb) {
  if (err) return cb(err);
  else return cb(null, true);
}
