const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const git = require('./git');
const npm = require('./npm');
const client = require('strider-ecosystem-client');
const localPlugins = require('./local_plugins');
module.exports = function (pluginsPath) {
    const local = localPlugins(pluginsPath);
    const home = pluginsPath[0];
    /*
     * Callback signature:
     *   cb(Error anyError, Boolean restartOrNot)
     */
    return function (name, cb) {
        local.listAllZipped(function (err, localPlugins) {
            if (err)
                return cb(err);
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
                }
                else if (remote) {
                    git.clone(remote.repo, remote.tag, pluginPath, function (err) {
                        if (err)
                            return cb(err);
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
        if (err)
            return cb(err);
        else
            return cb(null, true);
    });
}
//# sourceMappingURL=install_plugin.js.map