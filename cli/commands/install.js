'use strict';

module.exports = function (deps, parser) {
  var pluginManager = require('../lib/plugin_manager')(deps.getPluginPath()());

  parser
    .command('install')
    .help('Install a plugin from the ecosystem.')
    .callback(function (opts) {
      var plugin = opts._[1];

      if (plugin) {
        pluginManager.install(plugin, function (err, restart) {
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
          'Please pass in a plugin name. Find plugins with `strider list --all`.'
        );
      }
    });
};
