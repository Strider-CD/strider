/*jshint laxcomma:true */


/**
 * The Strider (web) app.
 */


var backchannel = require('./backchannel')
  , common = require('./common')
  , express = require('express')
  , EventEmitter = require('events').EventEmitter
  , everypaas = require('everypaas')
  , logging = require('./logging')
  , middleware = require('./middleware')
  , mongoose = require('mongoose')
  , mongoStore = require('connect-mongo')(express)
  , routes = require('../routes')
  , websockets = require('./websockets')
  , models = require('./models')

  , routes_admin = require('../routes/admin/index.js')
  , routes_jobs = require('../routes/jobs/index.js')
  , api = require('../routes/api')
  , api_account = require('../routes/api/account.js')
  , api_admin = require('../routes/api/admin/index.js')
  , api_collaborators = require('../routes/api/collaborators')
  , api_jobs = require('../routes/api/jobs.js')
  , api_repo = require('../routes/api/repo.js')
  , api_webhooks = require('../routes/api/webhooks')

  , auth = require('./auth')

  , path = require('path')
  , swig = require('swig')
  , pluginTemplates = require('./pluginTemplates')

var MONTH_IN_MILLISECONDS = 2629743000;
var session_store;

var init = exports.init = function (config) {

  var mongodbUrl = config.db_uri;
  console.log("Using MongoDB URL: %s", mongodbUrl);
  mongoose.connect(mongodbUrl, function(e){
    if (e) {
      console.error("Could not connect to DB: %s", e);
      process.exit(1);
    }
  });
  mongoose.connection.on('error', function(e) {
    console.error("MongoDB connection error: %s", e);
  });
  session_store = new mongoStore({db: mongoose.connection.db})


  swig.init({
      root: config.viewpath,
      allowErrors: true // allows errors to be thrown and caught by express instead of suppressed by Swig
    , cache: false
    , filters: require('./swigFilters')
    , tags: require('./swigTags').tags
    , simpleTags: require('./swigTags').simpleTags
    , extensions: {plugin: pluginTemplates}
  });

  var app = express();

  app.configure('development', function () {
    // awesome view testingness
    var utils = require('express/lib/utils')
    function matcher(path) {
      var params = []
        , rx = utils.pathRegexp(path, params)
      return function (pathname) {
        var match = rx.exec(pathname)
          , data = {}
        if (!match) return false
        for (var i=0; i<params.length; i++) {
          data[params[i].name] = match[i + 1]
        }
        return data
      }
    }
    var paths = [
      {
        path: matcher('/:org/:repo/'), 
        template: 'build.html',
        fixture: 'project'
      },
      {
        path: matcher('/:org/:repo/config'),
        template: 'project_config.html',
        fixture: 'config'
      }
    ]
    
    app.use(function (req, res, next) {
      var test = req.query.test
        , pathname = req._parsedUrl.pathname
        , params
        , config
      if ('undefined' === typeof test) return next()
      for (var i=0; i<paths.length; i++) {
        params = paths[i].path(pathname)
        if (params) {
          config = paths[i]
          break
        }
      }
      if (!config) {
        console.warn("Looks like you're trying to test a route, but there's no config for '%s'.", req.route.path)
        return next()
      }
      var data
        , filename = path.join(__dirname, '../test/views/' + config.fixture)
      if (require.cache[filename]) delete require.cache[filename]
      try {
        data = require(filename)
      } catch (e) {
        return req.send('Failed to load fixture: ' + e.message)
      }
      function send(data) {
        console.log(config.template, data)
        res.render(config.template, data)
      }
      if ('function' === typeof data) {
        return data(test, params, req, function (err, data) {
          if (err) return res.send('Failed to load data: ' + e.message)
          send(data)
        })
      }
      send(data)
    })
  })

  app.configure(function(){
    app.set('views', __dirname + '/../views');

    app.set('view engine', 'jade');
    app.engine('jade', require('jade').__express);
    app.engine('html', pluginTemplates.engine);

    app.use(middleware.bodySetter);
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(express.favicon(__dirname + '/../public/favicon.ico', { maxAge: 2592000000 }));
    app.use(require('stylus').middleware({ src: __dirname + '/../public' }));

    app.use(express.session({
        secret: config.session_secret, store: session_store,
        cookie: {maxAge: MONTH_IN_MILLISECONDS}
      }));

    app.use(function(req, res, next){
      res.locals.models = models;
      next();
    })

    auth.setup(app); // app.use(passport) is included

    app.use(express.static(__dirname + '/../public', {maxAge: MONTH_IN_MILLISECONDS}));

    app.use(app.router);


    app.use(function(req, res, next) {
      var user_created_timestamp=0;
      if (req.user !== undefined) {
        user_created_timestamp = parseInt(req.user.id.substr(0,8),16);
      }
      res.locals.user_created_timestamp = user_created_timestamp;
      next();
    });
  });

  app.configure('development', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));

  });

  app.configure('production', function(){
    app.use(express.errorHandler({ dumpExceptions: true, showStack: false}));
  });

  // Routes

  app.get('/', routes.index);
  app.get('/about',function(req, res) {
     res.render('about');
   });

  // Docs page (single page for moment)
  app.get('/docs', function(req, res) {res.render('docs');});
  app.get('/docs/getting_started', function(req, res) {res.render('docs/GettingStarted');});
  app.get('/docs/why_heroku_api_key', function(req, res) {res.render('docs/whyHerokuAPIKey');});

  app.get('/admin/projects', auth.requireAdminOr401, routes_admin.projects);
  app.get('/admin/users', auth.requireAdminOr401, routes_admin.users);
  app.get('/admin/jobs', auth.requireAdminOr401, function(req, res) {
    res.render('admin/jobs.html')});
  app.get('/admin/make_admin', auth.requireAdminOr401, routes_admin.make_admin);
  app.get('/admin/invites', auth.requireAdminOr401, routes_admin.invites);
  app.get('/admin/:org/:repo/job/:job_id', auth.requireAdminOr401, routes_admin.job);

  app.get('/account', auth.requireUser, routes.account);
  // deprecating in favor of "projects"
  app.get('/add_repo', auth.requireUser, function(req, res) { res.render('add_repo.html'); });
  app.get('/projects', auth.requireUser, function(req, res) { res.render('add_repo.html'); });

  /* Requires at least read-only access to the repository in the path */
  app.get('/:org/:repo/', auth.requireReadAccess, routes_jobs.job);
  app.get('/:org/:repo/job/:job_id', auth.requireReadAccess, routes_jobs.job);
  app.get('/:org/:repo/latest_build', auth.requireReadAccess, routes_jobs.job);

  // todo: make a config option to make this private?
  app.get('/:user/:org/:repo/badge', routes_jobs.badge);

  /* Requires admin access to the repository in the path */
  app.get('/:org/:repo/config', auth.requireUser, auth.requireRepoAdmin, routes.config);

  app.all(
    '/:org/:repo/config/:branch/:plugin',
    auth.requireUser,
    auth.requireRepoAdmin,
    middleware.project,
    middleware.projectPlugin
  )
  app.get('/:org/:repo/config/:branch/:plugin', routes.getPluginConfig);
  app.put('/:org/:repo/config/:branch/:plugin', routes.setPluginConfig);

  app.post('/webhook', routes.webhook_signature);
  app.post('/webhook/:secret',routes.webhook_secret);

  app.get('/kickoff/:githubId', auth.requireUserOr401, routes.kickoff);
  app.get('/manual_setup', auth.requireUserOr401, function(req,res) {res.render('manual_setup.html');});

  /*
  app.post('/api/github/manual_setup',
    auth.requireUserOr401,
    middleware.require_params(["github_url"]),
    api_github.post_manual_setup);
  app.get('/api/github/metadata', auth.requireUserOr401, api_github.github_metadata);
  app.post('/api/github/webhooks/unset', auth.requireUserOr401, api_github.github_webhooks_unset);
  */

  app.get('/api/admin/jobs', auth.requireAdminOr401, api_admin.admin_jobs_status);
  app.get('/api/admin/users', auth.requireAdminOr401, api_admin.get_user_list);
  app.post('/api/admin/invite/new', auth.requireAdminOr401, api.invite_new);

  // this should be app.del and delete should be removed from the end
  // that requires javascript on client side
  app.get('/:org/:repo/delete', auth.requireRepoAdmin, routes.delete_project);

  app.get('/api/job/:id', api_jobs.raw);
  app.get('/api/jobs', auth.requireUserOr401, api_jobs.jobs);
  app.get('/api/jobs/:org/:repo', auth.requireReadAccess, api_jobs.repo_jobs);
  // XXX: We may only want to allow admin users to start jobs in the future (ie require_resource_auth middleware)
  // especially if we are doing more 'public dashboard' type deployments.
  app.post('/api/jobs/start', auth.requireUserOr401, api_jobs.jobs_start);
  /*
  app.post('/api/heroku/account_integration', auth.requireUserOr401, api_heroku.heroku_account_integration);
  app.post('/api/heroku/delivery_integration', auth.requireUserOr401, api_heroku.heroku_delivery_integration);
  app.post('/api/heroku/config', auth.requireUserOr401, middleware.require_params(["url"]), api_heroku.heroku_config);
  */

  app.post('/api/account/password', auth.requireUserOr401, api_account.account_password);
  app.post('/api/account/email', auth.requireUserOr401, api_account.account_email);

  app.get('/status', routes.status);

  app.post('/login', auth.authenticate);
  app.get('/logout', auth.logout);



  // collaborators
  app.get('/api/collaborators',
    auth.requireUserOr401,
    middleware.require_params(["url"]),
    api_collaborators.get_index);
  app.post('/api/collaborators',
    auth.requireUserOr401,
    middleware.require_params(["url", "email"]),
    api_collaborators.post_index);
  app.delete('/api/collaborators',
    auth.requireUserOr401,
    middleware.require_params(["url", "email"]),
    api_collaborators.delete_index);


  // webhooks
  app.get('/api/webhooks',
    auth.requireUserOr401,
    middleware.require_params(["url"]),
    api_webhooks.get_index);
  app.post('/api/webhooks',
    auth.requireUserOr401,
    middleware.require_params(["url", "target_url", "secret"]),
    api_webhooks.post_index);
  app.delete('/api/webhooks',
    auth.requireUserOr401,
    middleware.require_params(["url"]),
    api_webhooks.delete_index);


  app.get('/api/repo/plugin',
    auth.requireUserOr401,
    middleware.require_params(["repo"]),
    api_repo.getPlugins);

  app.post('/api/repo/plugin',
    auth.requireUserOr401,
    middleware.require_params(["repo", "plugins"]),
    api_repo.postPlugins);

  // repo config
  app.get('/api/repo',
    auth.requireUserOr401,
    middleware.require_params(["url"]),
    api_repo.get_index);
  app.post('/api/repo',
    auth.requireUserOr401,
    middleware.require_params(["url", "active"]),
    api_repo.post_index);
  app.delete('/api/repo',
    auth.requireUserOr401,
    middleware.require_params(["url"]),
    api_repo.delete_index);


  common.app = app;
  common.session_store = session_store;
  //
  // ### Strider Webapp Event Emitter
  //
  // Strider has a Node.Js Event Emitter which emits many events.  This can be
  // used by extensions to add extremely flexible custom handling for just about
  // anything.
  //
  common.emitter = new EventEmitter();

  return app;
};



var run = exports.run = function(app){
  var config = require('./config');


  // Custom 404 handler.
  // Run after extensions, which might load static middlewares.
  app.use(middleware.custom404);

  var server = app.listen(config.server_port);
  // Initialize socket.io
  websockets.init(app, server, session_store);
  backchannel.init();
  console.info("Express server listening on port %d in %s mode", config.server_port, app.settings.env);
}


