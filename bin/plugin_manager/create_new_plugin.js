var localPlugins = require('./local_plugins')
var prompt = require('prompt')
var path = require('path')
var fs = require('fs')
var spawn = require('child_process').spawn

module.exports = function () {
  var pluginsPath = localPlugins.path()
  prompt.message = "plugin";
  prompt.start()
  var schema = {
    properties: {
      name: {
        pattern: /^[a-z\_\-]+$/,
        message: 'Name must be only lowercase letters, underscores, or dashes',
        required: true
      },
      description: {
        required: true
      },
      author: {}
    }
  }
  prompt.get(schema, function (err, res) {
    if (err) {
      console.error(err.message)
      return;
    }
    var pluginPath = path.join(pluginsPath, res.name)
    if (fs.existsSync(pluginPath)) {
      console.error(res.name+' already exists: '+pluginPath)
    } else {
      spawn('git', [
        'clone', 'git@github.com:bitwit/strider-template.git', pluginPath
      ], { stdio: 'inherit' }).on('close', function (code) {
        if (code !== 0) {
          throw new Error('git clone failed with non-zero status '+code)
        } else {
          var pkgPath = path.join(pluginPath, 'package.json')
          fs.readFile(pkgPath, function (err, jsonFile) {
            if (err) throw err;
            var pkg = JSON.parse(jsonFile)
            Object.keys(schema.properties).forEach(function (key) {
              pkg[key] = res[key]
            })
            fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2), function () {
              console.log(
                ["", "A strider plugin template has been prepared for you in the following directory"
                ,"\t"+pluginPath
                ,"Please view the README and begin editing the package.json."
                ,"Make sure to change the git remote to wherever you're hosting your plugin source code"
                ,"When you're ready to publish, submit a pull request to https://github.com/Strider-CD/strider-plugins"
                ,"If you have any questions or need help, you can find us in irc.freenode.net #strider"
              ].join("\n"))
            })
          })
        }
      })
    }
  })
}
