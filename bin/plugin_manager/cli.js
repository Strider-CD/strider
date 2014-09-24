var getPluginPath = require('../../lib/plugin_path');

module.exports = function (parser) {
  parser.command('list-plugins')
  .callback(function(opts){
    console.log(pluginsPath)
  })
}
