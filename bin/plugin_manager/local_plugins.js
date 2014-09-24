var path = require('path')
var getPluginPath = require('../../lib/plugin_path');
var glob = require('glob')
var _ = require('lodash')

module.exports = {
  path: fullPath,
  listAll: listAll,
  zip: function (plugins) {
    return _.zipObject(
      _.pluck(plugins, 'name'),
      _.map(plugins, function (plugin) {
        return {
          version: plugin.version,
          path: plugin.path
        }
      })
    ) 
  }
}

function fullPath() {
  return getPluginPath()[0]
}

function getPluginFullPaths(cb) {
  glob(path.join(fullPath(), 'strider-*'), cb)
}

function listAll(cb) {
  getPluginFullPaths(function (err, plugins) {
    var out = []
    plugins.forEach(function (fullPath) {
      out.push({
        path: fullPath,
        name: path.basename(fullPath),
        version: require(path.join(fullPath, 'package.json')).version
      })
    })
    cb(err, out);
  })
}
