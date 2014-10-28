'use strict';

var async = require('async');
var slashes = require('connect-slashes');
var apiConfig = require('../routes/api/config');
var common = require('../common');
var app = require('../app');

function loadExtensions(loader, extdir, context, appInstance, cb) {
  loader.collectExtensions(extdir, function (err) {
    if (err) return cb(err);

    async.parallel([
      function (next) {
        loader.initWebAppExtensions(context, function (err, webapps) {
          if (err) return next(err);

          common.extensions = webapps;
          console.log('initalized webapps');

          for (var type in webapps) {
            console.log('[' + type + ' plugins]');
            for (var id in webapps[type]) {
              console.log('- ' + id);
            }
          }

          next();
        })
      },

      function (next) {
        loader.initTemplates(function (err, templates) {
          if (err) return next(err);

          for (var name in templates) {
            pluginTemplates.register(name, templates[name]);
          }

          console.log('loaded templates');
          next();
        })
      },

      function (next) {
        loader.initStaticDirs(appInstance, function (err) {
          console.log('initalized static directories');
          next();
        });
      },

      function (next) {
        apiConfig.cacheConfig(loader, next);
      }
    ], function (err) {
      if (err) {
        console.error(err);
        console.error('Failed to load plugins');
        return cb(err, appInstance);
      }

      console.log('loaded plugins');
      appInstance.use(slashes(true, true));
      app.run(appInstance);
      cb(null, appInstance);
    });
  });
}

module.exports = loadExtensions;
