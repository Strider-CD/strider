module.exports = function() {
  var _ = require('lodash')
  var Table = require('cli-table');
  var table = new Table({
    chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
    head: ['name', 'stable', 'installed']
  });
  var localPlugins = require('./local_plugins')
  var getPluginPath = require('../../lib/plugin_path');
  var path = require('path')
  var yaml = require ('js-yaml')
  var remote = require('./remote_plugins')
  var local = require('./local_plugins')
  //var url = 'https://raw.githubusercontent.com/Strider-CD/strider-plugins/master/index'
  var url = 'http://localhost:8000/index'
  remote.fetchIndex(url).then(function (remotePlugins) {
    local.listAll(function (err, localPlugins) {
      localPlugins = local.zip(localPlugins)
      remotePlugins.forEach(function (plugin) {
        var local = localPlugins[plugin.name]
        table.push([
          plugin.name,
          plugin.version,
          local ? local.version : ''
        ])
      })
      console.log(table.toString());
    })
  }).error(errHandle).catch(errHandle)
}

function errHandle(err) {
  console.error('Error!\n'+err.message+'\n'+err.stack)
}
