var common = require('../../../lib/common')
  , path = require('path')
  , pluginPath = require('../../../lib/plugin_path')()
  , localPlugins = require('strider-cli/plugin_manager/local_plugins')(pluginPath)
  , client = require('strider-cli/node_modules/strider-ecosystem-client')


/* Web interface for global plugin management */
module.exports = function(req, res, next) {
  var plugins = {}
  client.fetchPlugins().then(function(remotePlugins) {
    Object.keys(remotePlugins).forEach(function (name) {
      var remote = remotePlugins[name]
      plugins[name] = {
        url: remote.repo,
        type: remote.type,
        description: remote.description,
        latestVersion: remote.tag,
        installedVersion: 'no',
        installedPath: null,
        installed: false
      }
    })

    localPlugins.listAll(function(err, localPlugins) {
      localPlugins.forEach(function(plugin) {
        if (! plugins[plugin.name]) {
          var pkg = require(path.join(plugin.path, 'package.json'))
          plugins[plugin.name] = {
            description: pkg.description,
            type: pkg.strider.type,
            latestVersion: 'unlisted'
          }
        }
        plugins[plugin.name].installedVersion = plugin.version
        plugins[plugin.name].installedPath = plugin.path
        plugins[plugin.name].installed = true
      })

      res.render('admin/plugins.html', {
        plugins: plugins
      })
    })
  }).error(next).catch(next)
}
