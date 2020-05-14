'use strict';

module.exports = function (deps, parser) {
  var pluginManager = require('../lib/plugin_manager')(deps.getPluginPath()());

  parser
    .command('uninstall')
    .help('Uninstall a plugin')
    .callback(function (opts) {
      var plugin = opts._[1];

      if (plugin) {
        pluginManager.uninstall(plugin, function (err, restart) {
          if (err) {
            console.error(err.stack);
          } else {
            if (restart) {
              require('../lib/resilient')(deps).restart();
            }
          }
        });
      } else {
        console.error(
          'Please pass in a plugin name. See installed plugins with `strider list`.'
        );
      }
    });
};
