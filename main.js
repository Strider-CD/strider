var app = require('./lib/app'),
    backchannel = require('./lib/backchannel'),
    common = require('./lib/common'),
    config = require('./config'),
    loader = require('strider-extension-loader'),
    middleware = require('./lib/middleware'),
    models = require('./lib/models'),
    Step = require('step'),
    websockets = require('./lib/websockets');

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

// Initialize the (web) app
var appInstance = app.init(config);

//
// ### Strider Context Object
//
// Context object is passed to each extension.  It carries various config
// settings, as well as handles to enable functions to register things.
// Context can also be accessed as a singleton within Strider as
// common.context.
var context = {
  config: config,
  emitter: common.emitter,
  extensionRoutes: [],
  extdir: common.extdir,
  loader: loader,
  models: models,
  middleware: middleware,
  registerWorkerMessageHook: registerWorkerMessageHook,
  registerWorkerMessagePostProcessor: registerWorkerMessagePostProcessor,
  registerPanel: registerPanel,
};

// Make extension context available throughout application.
common.context = context;

module.exports = function(extdir) {
  context.extdir = extdir;
  Step(
    function() {
      // Initialize only "webapp" extensions here.
      // Worker is a separate process, it initializes "worker" extensions.
      loader.initExtensions(extdir, "webapp", context, appInstance, this);
    },
    function(err, initialized) {

      // Handle GET 404s with custom page.
      // Comes after extensions in middleware chain as they may have
      // loaded static servers.
      appInstance.use(middleware.custom404);
      var port = process.env.PORT || config.server_port;
      appInstance.listen(port);
      // Initialize socket.io
      websockets.init(appInstance, common.session_store);
      backchannel.init();
      console.info("Express server listening on port %d in %s mode",
        port, appInstance.settings.env);
      //console.log("Environment: %j", process.env);
    }
  );
};
