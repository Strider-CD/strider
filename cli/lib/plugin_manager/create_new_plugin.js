const prompt = require('prompt');
const path = require('path');
const git = require('./git');
const fs = require('fs');

module.exports = function (pluginsPath) {
  const localPlugins = require('./local_plugins')(pluginsPath);
  var pluginsPath = localPlugins.path();
  prompt.message = 'plugin';
  prompt.start();

  const schema = {
    properties: {
      name: {
        pattern: /^[a-z\_\-]+$/,
        message: 'Name must be only lowercase letters, underscores, or dashes',
        required: true,
      },
      description: {
        required: true,
      },
      author: {},
    },
  };

  prompt.get(schema, function (err, res) {
    if (err) {
      console.error(err.message);
      return;
    }
    const pluginPath = path.join(pluginsPath, res.name);
    if (fs.existsSync(pluginPath)) {
      console.error(res.name + ' already exists: ' + pluginPath);
    } else {
      git.clone(
        'https://github.com/Strider-CD/strider-template.git',
        'v1.0.1',
        pluginPath,
        function (err) {
          if (err) throw err;
          const pkgPath = path.join(pluginPath, 'package.json');
          fs.readFile(pkgPath, function (err, jsonFile) {
            if (err) throw err;
            const pkg = JSON.parse(jsonFile);
            Object.keys(schema.properties).forEach(function (key) {
              pkg[key] = res[key];
            });
            pkg['strider']['id'] = res.name;
            fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2), function () {
              console.log(
                [
                  '',
                  'A strider plugin template has been prepared for you in the following directory',
                  '\t' + pluginPath,
                  'Please view the README and begin editing the package.json.',
                  "Make sure to change the git remote to wherever you're hosting your plugin source code",
                  "When you're ready to publish, submit a pull request to https://github.com/Strider-CD/strider-plugins",
                  'If you have any questions or need help, you can find us in irc.freenode.net #strider',
                ].join('\n')
              );
            });
          });
        }
      );
    }
  });
};
