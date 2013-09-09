var app = require('./lib/app')
  , backchannel = require('./lib/backchannel')
  , common = require('./lib/common')
  , config = require('./lib/config')
  , loader = require('strider-extension-loader')
  , middleware = require('./lib/middleware')
  , auth = require('./lib/auth')
  , models = require('./lib/models')
  , websockets = require('./lib/websockets')
  , pluginTemplates = require('./lib/pluginTemplates')
  , utils = require('./lib/utils')

  , _ = require('lodash')


common.extensions = {}
require('./defaultExtensions')(common.extensions);

//
// ### Register panel
//
// A panel is simply a snippet of HTML associated with a given key.
// Strider will output panels registered for specific template.
//
function registerPanel(key, value) {
  // Nothing yet registered for this panel
  key = value.id // 
    console.log("!!", key)
  if (common.extensions[key] === undefined) {
    common.extensions[key] = {panel : value}
  } else {
    if (common.extensions[key].panel){
      console.log("!!", key, common.extensions[key], value)
      throw "Multiple Panels for " + key
    }
    common.extensions[key].panel = value;
  }
}

module.exports = function(extdir, c, callback) {
  var appConfig = config;
  // override with c
  for (var k in c){
    appConfig[k] = c[k];
  }


  // Initialize the (web) app
  var appInstance = app.init(appConfig);
  var cb = callback || function() {}

  //
  // ### Strider Context Object
  //
  // Context object is passed to each extension.  It carries various config
  // settings, as well as handles to enable functions to register things.
  // Context can also be accessed as a singleton within Strider as
  // common.context.
  var context = {
    config: appConfig,
    enablePty: config.enablePty,
    emitter: common.emitter,
    extensionRoutes: [],
    extdir: extdir,
    loader: loader,
    models: models,
    logger: console,
    middleware: middleware,
    auth: auth, //TODO - may want to make this a subset of the auth module
    registerPanel: registerPanel,
    registerBlock: pluginTemplates.registerBlock,
  };

  // Make extension context available throughout application.
  common.context = context;
  loader.initWebAppExtensions(extdir, context, appInstance,
    function(err, initialized, templates) { 
      if (err) {
        return cb(err)
      }

      if (templates){
        for (var k in templates){
          pluginTemplates.registerTemplate(k, templates[k]);
        }
      }

      loader.initRunnerExtensions(extdir, context, function(err, loaded){
        console.log("Environment Runner's loaded:" , loaded)
        if (!loaded || loaded.length < 1) throw "No EnvironmentRunner Loaded!";
        // FOR NOW WE JUST USE THE FIRST: TODO - make this selectable.
        var runner = loaded[0]

        context.loader.listWorkerExtensions(extdir, function(err, workers){
          common.availableWorkers = workers;
          workers.forEach(function(x){
            console.log("Extension", x.id , "available")

            if (common.extensions[x.id] === undefined) {
              common.extensions[x.id] = x
            } else {
              console.log("!!! Multiple extension", x)
            }
          })

          runner.create(context.emitter, {}, function(){

            // We're all up and running
            common.availableWorkers = workers
            app.run(appInstance);
            cb(err, initialized, appInstance)
          });
        })
      })

  });

  return appInstance;
};
