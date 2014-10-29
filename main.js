'use strict';

var path = require('path');
var passport = require('passport');
var async = require('async');
var _ = require('lodash');
var Loader = require('strider-extension-loader');

var app = require('./lib/app');
var common = require('./lib/common');
var config = require('./lib/config');
var middleware = require('./lib/middleware');
var auth = require('./lib/auth');
var models = require('./lib/models');
var pluginTemplates = require('./lib/plugin-templates');
var utils = require('./lib/utils');
var apiConfig = require('./lib/routes/api/config');
var upgrade = require('./lib/models/upgrade').ensure;
var loadExtensions = require('./lib/utils/load-extensions');
var pkg = require('./package');

var Job = models.Job;
var Config = models.Config;

common.extensions = {};

//
// ### Register panel
//
// A panel is simply a snippet of HTML associated with a given key.
// Strider will output panels registered for specific template.
//
function registerPanel(key, value) {
  // Nothing yet registered for this panel
  key = value.id;
  console.log('!! registerPanel', key)

  if (common.extensions[key] === undefined) {
    common.extensions[key] = { panel: value };
  } else {
    if (common.extensions[key].panel) {
      console.log('!!', key, common.extensions[key], value);
      throw 'Multiple Panels for ' + key;
    }

    common.extensions[key].panel = value;
  }
}

module.exports = function(extdir, c, callback) {
  var appConfig = config;
  var k;
  // override with c
  for (k in c) {
    appConfig[k] = c[k];
  }

  // Initialize the (web) app
  var appInstance = app.init(appConfig);
  var cb = callback || function(err) {
    if (err) throw err;
  }

  if (typeof Loader !== 'function') {
    throw new Error('Your version of strider-extension-loader is out of date');
  }

  var loader = new Loader([path.join(__dirname, 'client/styles')], true);
  appInstance.loader = loader;
  common.loader = loader;
  //
  // ### Strider Context Object
  //
  // Context object is passed to each extension.  It carries various config
  // settings, as well as handles to enable functions to register things.
  // Context can also be accessed as a singleton within Strider as
  // common.context.
  var context = {
    serverName: appConfig.strider_server_name,
    config: appConfig,
    enablePty: config.enablePty,
    emitter: common.emitter,
    extensionRoutes: [],
    extensionPaths: extdir,
    extdir: extdir,
    loader: loader,
    models: models,
    logger: console,
    middleware: middleware,
    auth: auth, //TODO - may want to make this a subset of the auth module
    passport: passport,
    registerPanel: registerPanel,
    registerBlock: pluginTemplates.registerBlock,
    app: appInstance
  };

  // Make extension context available throughout application.
  common.context = context;

  var SCHEMA_VERSION = Config.SCHEMA_VERSION;

  upgrade(SCHEMA_VERSION, function (err) {
    if (err) return cb(err)

    loadExtensions(loader, extdir, context, appInstance, function (err) {
      // kill zombie jobs
      killZombies(function () {
        var tasks = [];

        if (!common.extensions.runner || 'object' !== typeof common.extensions.runner) {
          console.error('Strider seems to have been misconfigured - there are no available runner plugins. ' +
            'Please make sure all dependencies are up to date.');
          process.exit(1);
        }

        Object.keys(common.extensions.runner).forEach(function (name) {
          var runner = common.extensions.runner[name];

          if (!runner) {
            console.log('no runner', name);
            return;
          }

          tasks.push(function (next) {
            Job.find({
              'runner.id': name,
              finished: null
            }, function (err, jobs) {
              if (err) {
                return next(err);
              }

              runner.findZombies(jobs, next);
            });
          })
        });

        async.parallel(tasks, function (err, zombies) {
          if (err) return cb(err);

          var ids = [].concat.apply([], zombies).map(function (job) { return job._id });
          var now = new Date();

          Job.update({_id: {$in: ids}}, {$set: {finished: now, errored: true, error: {message: 'Job timeout', stack: ''}}}, function (err) {
            Job.update({_id: {$in: ids}, started: null}, {$set: {started:  now}}, function (err) {
              cb(err, appInstance);
            });
          });
        });
      });
    });
  });

  return appInstance;
}

function killZombies(done) {
  console.log('Marking zombie jobs as finished...');

  Job.update({archived: null, finished: null},
    {$set: {finished: new Date(), errored: true}}, {multi: true}, 
    function(err, count) {
      if (err) throw err;
      console.log('%d zombie jobs marked as finished', count);
      done();
    }
  );
}

