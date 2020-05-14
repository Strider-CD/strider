const _ = require('lodash');
const path = require('path');
const semver = require('semver');
require('../../../common');
const pluginPath = require('../../../utils/plugin-path')();
const localPlugins = require('../../../cli/lib/plugin_manager/local_plugins')(pluginPath);
const client = require('strider-ecosystem-client');
module.exports = function getPluginList(cb) {
    let plugins = {};
    client
        .fetchPlugins()
        .then(function (remotePlugins) {
        Object.keys(remotePlugins).forEach(function (name) {
            const remote = remotePlugins[name];
            plugins[name] = {
                id: name,
                name: remote.name || name,
                url: remote.repo,
                type: remote.type,
                description: remote.description,
                latestVersion: remote.tag,
                installedVersion: 'no',
                installedPath: null,
                installed: false,
            };
        });
        localPlugins.listAll(function (err, localPlugins) {
            localPlugins.forEach(function (plugin) {
                let known = false;
                if (plugins[plugin.name]) {
                    known = true;
                }
                else {
                    known = false;
                    const pkg = require(path.join(plugin.path, 'package.json'));
                    plugins[plugin.name] = {
                        id: plugin.name,
                        name: plugin.title || plugin.name,
                        description: pkg.description,
                        type: pkg.strider.type,
                        latestVersion: 'unknown',
                    };
                }
                plugins[plugin.name].installedVersion = plugin.version;
                plugins[plugin.name].installedPath = plugin.path;
                plugins[plugin.name].installed = true;
                if (known) {
                    plugins[plugin.name].outdated = semver.lt(plugins[plugin.name].installedVersion, plugins[plugin.name].latestVersion);
                }
                else {
                    plugins[plugin.name].outdated = false;
                }
            });
            plugins = _.sortBy(plugins, 'name');
            cb(null, plugins);
        });
    })
        .error(cb)
        .catch(cb);
};
//# sourceMappingURL=get_plugin_list.js.map