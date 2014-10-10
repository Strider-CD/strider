module.exports = function() {
  var Table = require('cli-table');
  var path = require('path')
  var localPlugins = require('./local_plugins')
  var table = new Table({
    chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
    head: ['name', 'version']
  });
  localPlugins.listAll(function (err, plugins) {
    if (err) throw err;
    plugins.forEach(function (plugin) {
      table.push([
        plugin.name,
        plugin.version
      ])
    })
    console.log(table.toString());
  })
}
