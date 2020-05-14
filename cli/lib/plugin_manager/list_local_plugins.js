module.exports = function (pluginsPath) {
  const Table = require('cli-table');
  const localPlugins = require('./local_plugins')(pluginsPath);
  const table = new Table({
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
