'use strict';

var apiConfig = require('../routes/api/config');
var app = require('../app');
var async = require('async');
var common = require('../common');
var debug = require('debug')('strider:load-extensions');
var pluginTemplates = require('../plugin-templates');
var slashes = require('connect-slashes');

function loadExtensions(loader, extdir, context, appInstance, cb) {
  loader.collectExtensions(extdir, function (err) {
    if (err) return cb(err);

    async.parallel([
      function (next) {
        loader.initWebAppExtensions(context, function (err, webapps) {
          if (err) return next(err);

          common.extensions = webapps;
          debug('initalized webapps');

          for (var type in webapps) {
            debug('[' + type + ' plugins]');
            for (var id in webapps[type]) {
              debug('- ' + id);
            }
          }

          next();
        })
      },

      function (next) {
        loader.initTemplates(function (err, templates) {
          if (err) return next(err);

          for (var name in templates) {
            pluginTemplates.registerTemplate(name, templates[name]);
          }

          debug('loaded templates');
          next();
        })
      },

      function (next) {
        loader.initStaticDirs(appInstance, function (err) {
          debug('initialized static directories');
          next();
        });
      },

      function (next) {
        apiConfig.cacheConfig(loader, next);
      }
    ], function (err) {
      if (err) {
        debug(err);
        debug('Failed to load plugins');
        return cb(err, appInstance);
      }

      debug('loaded plugins');
      appInstance.use(slashes(true, true));
      app.run(appInstance);
      cb(null, appInstance);
    });
  });
}

module.exports = loadExtensions;
