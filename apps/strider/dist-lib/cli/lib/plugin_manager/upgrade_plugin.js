const rimraf = require('rimraf');
const install = require('./install_plugin');
const localPlugins = require('./local_plugins');
module.exports = function (pluginsPath) {
    const local = localPlugins(pluginsPath);
    /*
     * Callback signature:
     *   cb(Error anyError, Boolean restartOrNot)
     */
    return function (name, cb) {
        local.listAllZipped(function (err, plugins) {
            const plugin = plugins && plugins[name];
            if (plugin) {
                rimraf(plugin.path, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('removed ' + plugin.path);
                    install(pluginsPath)(name, cb);
                });
            }
            else {
                console.error(name + ' not found');
                cb();
            }
        });
    };
};
//# sourceMappingURL=upgrade_plugin.js.map