module.exports = function (pluginsPath) {
  var Loader = require('strider-extension-loader');
  var loader = new Loader();

  var path = require('path');
  var _ = require('lodash');

  return {
    path: fullPath,
    listAll: listAll,
    listAllZipped: listAllZipped,
  };

  function zip(plugins) {
    var ids = _.pluck(plugins, 'name');
    return _.zipObject(ids, plugins);
  }

  function fullPath() {
    return pluginsPath[0];
  }

  function getVersion(pluginPath) {
    return require(path.join(pluginPath, 'package.json')).version;
  }

  function listAll(cb) {
    loader.collectExtensions(pluginsPath, function (err) {
      var plugins = [];
      var extensions = loader.extensions;
      for (var groupName in extensions) {
        var group = extensions[groupName];
        for (var pluginName in group) {
          var plugin = group[pluginName];
          plugins.push({
            group: groupName,
            name: pluginName,
            path: plugin.dir,
            version: getVersion(plugin.dir),
            title: plugin.title,
          });
        }
      }
      cb(err, plugins);
    });
  }

  function listAllZipped(cb) {
    listAll(function (err, plugins) {
      cb(err, zip(plugins));
    });
  }
};
