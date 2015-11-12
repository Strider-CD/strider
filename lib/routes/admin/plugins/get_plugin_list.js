'use strict';

var path = require('path');
var semver = require('semver');
var common = require('../../../common');
var pluginPath = require('../../../plugin-path')();
var localPlugins = require('strider-cli/plugin_manager/local_plugins')(pluginPath);
var client = require('strider-ecosystem-client');

module.exports = function getPluginList(cb) {
  var plugins = {};

  client.fetchPlugins().then(function(remotePlugins) {
    Object.keys(remotePlugins).forEach(function (name) {
      var remote = remotePlugins[name];

      plugins[name] = {
        name: remote.name || name,
        url: remote.repo,
        type: remote.type,
        description: remote.description,
        latestVersion: remote.tag,
        installedVersion: 'no',
        installedPath: null,
        installed: false
      };
    });

    localPlugins.listAll(function(err, localPlugins) {
      localPlugins.forEach(function(plugin) {
        var known = false;

        if (plugins[plugin.name]) {
          known = true;
        } else {
          known = false;
          var pkg = require(path.join(plugin.path, 'package.json'));

          plugins[plugin.name] = {
            description: pkg.description,
            type: pkg.strider.type,
            latestVersion: 'unknown'
          };
        }

        plugins[plugin.name].installedVersion = plugin.version;
        plugins[plugin.name].installedPath = plugin.path;
        plugins[plugin.name].installed = true;

        if (known) {
          plugins[plugin.name].outdated = semver.lt(
            plugins[plugin.name].installedVersion,
            plugins[plugin.name].latestVersion
          );
        } else {
          plugins[plugin.name].outdated = false;
        }
      });

      cb(null, plugins);
    })
  }).error(cb).catch(cb);
};
