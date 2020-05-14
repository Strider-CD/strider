const _ = require('lodash'),
  fs = require('fs'),
  path = require('path'),
  git = require('./git'),
  npm = require('./npm'),
  client = require('strider-ecosystem-client');

module.exports = function (pluginsPath) {
  const local = require('./local_plugins')(pluginsPath);
  const home = pluginsPath[0];

  /*
   * Callback signature:
   *   cb(Error anyError, Boolean restartOrNot)
   */
  return function (name, cb) {
    local.listAllZipped(function (err, localPlugins) {
      if (err) return cb(err);
      client
        .fetchPlugins()
        .then(function (remotePlugins) {
          const local = localPlugins[name];
          const remote = remotePlugins[name];
          if (!remote) {
            console.error(name + ' is not a valid plugin');
            return cb();
          }

          const pluginPath = path.join(home, remote.module_name);

          if (local || fs.existsSync(pluginPath)) {
            afterCloned(pluginPath, cb);
          } else if (remote) {
            git.clone(remote.repo, remote.tag, pluginPath, function (err) {
              if (err) return cb(err);
              afterCloned(pluginPath, cb);
            });
          }
        })
        .error(cb)
        .catch(cb);
    });
  };
};

function afterCloned(pluginPath, cb) {
  npm(pluginPath).install(function (err) {
    if (err) return cb(err);
    else return cb(null, true);
  });
}
