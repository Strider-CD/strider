const apiConfig = require('../routes/api/config');
const app = require('../app');
const async = require('async');
const common = require('../common');
const debug = require('debug')('strider:load-extensions');
const pluginTemplates = require('../plugin-templates');
const slashes = require('connect-slashes');

function loadExtensions(loader, extdir, context, appInstance, cb) {
  loader.collectExtensions(extdir, function(err) {
    if (err) return cb(err);

    async.parallel(
      [
        function(next) {
          loader.initWebAppExtensions(context, function(err, webapps) {
            if (err) return next(err);

            common.extensions = webapps;
            debug('initalized webapps');

            for (const type in webapps) {
              debug(`Found ${type} plugins:`);
              for (const id in webapps[type]) {
                debug(`  - ${id}`);
              }
            }

            next();
          });
        },

        function(next) {
          loader.initTemplates(function(err, templates) {
            if (err) return next(err);

            for (const name in templates) {
              pluginTemplates.registerTemplate(name, templates[name]);
            }

            debug('loaded templates');
            next();
          });
        },

        function(next) {
          loader.initStaticDirs(appInstance, function() {
            debug('initialized static directories');
            next();
          });
        },

        function(next) {
          apiConfig.cacheConfig(loader, next);
        }
      ],
      function(err) {
        if (err) {
          debug(err);
          debug('Failed to load plugins');
          return cb(err, appInstance);
        }

        debug('loaded plugins');
        appInstance.use(slashes(true, true));
        app.run(appInstance);
        cb(null, appInstance);
      }
    );
  });
}

module.exports = loadExtensions;
