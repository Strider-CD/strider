module.exports = function() {
  var fs = require('fs')
  var Table = require('cli-table');
  var glob = require('glob')
  var path = require('path')
  var getPluginPath = require('../../lib/plugin_path');
  var extdir = getPluginPath()[0]
  var table = new Table({
    chars: {'mid': '', 'left-mid': '', 'mid-mid': '', 'right-mid': ''},
    head: ['name', 'version', /*'git repo?'*/]
  });
  glob(path.join(extdir, 'strider-*'), function (err, plugins) {
    if (err) throw err;
    plugins.forEach(function (fullPath) {
      var name = path.basename(fullPath)
      var version = require(path.join(fullPath, 'package.json')).version
      //var isRepo = fs.existsSync(path.join(fullPath, '.git'))
      table.push([
        name.replace('strider-', ''),
        version,
        //isRepo ? 'yes' : 'no'
      ])
    })
    console.log(table.toString());
    console.log('Plugin path: ', extdir)
  })
}
