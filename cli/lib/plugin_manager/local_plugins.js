const path = require('path');
const _ = require('lodash');
const Loader = require('strider-extension-loader');

module.exports = function (pluginsPath) {
  const loader = new Loader();

  return {
    path: fullPath,
    listAll: listAll,
    listAllZipped: listAllZipped,
  };

  function zip(plugins) {
    const ids = _.map(plugins, 'name');
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
      const plugins = [];
      const extensions = loader.extensions;
      for (const groupName in extensions) {
        const group = extensions[groupName];
        for (const pluginName in group) {
          const plugin = group[pluginName];
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
