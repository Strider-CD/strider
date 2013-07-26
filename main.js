var app = require('./lib/app'),
    backchannel = require('./lib/backchannel'),
    common = require('./lib/common'),
    config = require('./lib/config'),
    loader = require('strider-extension-loader'),
    middleware = require('./lib/middleware'),
    auth = require('./lib/auth')
    models = require('./lib/models'),
    websockets = require('./lib/websockets')
    , pluginTemplates = require('./lib/pluginTemplates')

common.workerMessageHooks = [];
common.workerMessagePostProcessors = [];
common.panels = {};

//
// ### Register panel
//
// A panel is simply a snippet of HTML associated with a given key.
// Strider will output panels registered for specific template.
//
// For example, if an extension wanted to add client-side code to the project config page,
// it would register a panel for "project_config" key.
//
function registerPanel(key, value) {
  // Nothing yet registered for this panel
  if (common.panels[key] === undefined) {
    common.panels[key] = [value];
  } else {
    common.panels[key].push(value);
  }
}

//
// ### Register worker message post-processor
//
// A Strider worker message post-processor is a function which is called on the final
// JSON-serialized ZMQ messages destined for workers. These can be used to e.g.
// implement encryption of ZMQ messages. They are expected to be callback functions
// which return asynchronously.
//
// Signature: function(data, cb) { cb(null, result) }
//
function registerWorkerMessagePostProcessor(f) {
  common.workerMessagePostProcessors.push(f);
}

//
// ### Register worker message hook
//
// Strider worker message hooks are callback functions used to extend a message object
// paloads. Multiple hooks are supported and are expected to callback with an
// object which will be merged into the final message.
//
// For example, a worker message hook function might call back with an object like:
//
// {"heroku":{"app":"myapp"}}
//
// Which will then be merged into the output message to worker.
//
function registerWorkerMessageHook(f) {
  common.workerMessageHooks.push(f);
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
    emitter: common.emitter,
    extensionRoutes: [],
    extdir: extdir,
    loader: loader,
    models: models,
    logger: console,
    middleware: middleware,
    auth: auth, //TODO - may want to make this a subset of the auth module
    registerWorkerMessageHook: registerWorkerMessageHook,
    registerWorkerMessagePostProcessor: registerWorkerMessagePostProcessor,
    registerPanel: registerPanel,
    registerBlock: pluginTemplates.registerBlock,
  };

  // Make extension context available throughout application.
  common.context = context;
  loader.initExtensions(extdir, "webapp", context, appInstance,
    function(err, initialized, templates) { 
      if (err) {
        return cb(err)
      }

      if (templates){
        for (var k in templates){
          pluginTemplates.registerTemplate(k, templates[k]);
        }
      }
      app.run(appInstance);
      cb(err, initialized, appInstance) 
  });

  return appInstance;
};
