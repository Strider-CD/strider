module.exports = function (pluginsPath) {
  var Table = require('cli-table');
  var localPlugins = require('./local_plugins')(pluginsPath);
  var table = new Table({
    chars: { mid: '', 'left-mid': '', 'mid-mid': '', 'right-mid': '' },
    head: ['name', 'version'],
  });
  localPlugins.listAll(function (err, plugins) {
    if (err) throw err;
    plugins.forEach(function (plugin) {
      table.push([plugin.name, plugin.version]);
    });
    console.log(table.toString());
  });
};
