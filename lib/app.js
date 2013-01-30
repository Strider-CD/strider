/*jshint laxcomma:true */


/**
 * The Strider (web) app.
 */


var auth = require('./auth')
    , apres = require('apres')
    , backchannel = require('./backchannel')
    , common = require('./common')
    , express = require('express')
    , EventEmitter = require('events').EventEmitter
    , everypaas = require('everypaas')
    , logging = require('./logging')
    , middleware = require('./middleware')
    , mongoose = require('mongoose')
    , mongoose_auth = require('mongoose-auth')
    , mongoStore = require('connect-mongo')(express)
    , routes = require('../routes')
    , websockets = require('./websockets')

    , routes_admin = require('../routes/admin/index.js')
    , routes_jobs = require('../routes/jobs/index.js')
    , api = require('../routes/api')
    , api_account = require('../routes/api/account.js')
    , api_admin = require('../routes/api/admin/index.js')
    , api_collaborators = require('../routes/api/collaborators')
    , api_github = require('../routes/api/github.js')
    , api_heroku = require('../routes/api/heroku.js')
    , api_jobs = require('../routes/api/jobs.js')
    , api_repo = require('../routes/api/repo.js')
    , api_webhooks = require('../routes/api/webhooks')
    ;


var MONTH_IN_MILLISECONDS = 2629743000;
var session_store;

var init = exports.init = function (config) {

  var mongodbUrl = everypaas.getMongodbUrl() || config.db_uri;
  console.log("Using MongoDB URL: %s", mongodbUrl);
  mongoose.connect(mongodbUrl);
  session_store = new mongoStore({url: mongodbUrl});

  var app = express.createServer();

  app.configure(function(){
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'jade');
    app.set('view options', { pretty: true });
    app.use(middleware.bodySetter);
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());
    app.use(require('stylus').middleware({ src: __dirname + '/../public' }));
    app.use(express.session({secret: config.session_secret, store: session_store,
      cookie: {maxAge: MONTH_IN_MILLISECONDS}}));
    app.use(mongoose_auth.middleware());
    app.use(express.static(__dirname + '/../public', {maxAge: MONTH_IN_MILLISECONDS}));
    apres.helpExpress(app);
    app.use(app.router);
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

  app.get('/admin/projects', middleware.require_admin, routes_admin.projects);
  app.get('/admin/users', middleware.require_admin, routes_admin.users);
  app.get('/admin/jobs', middleware.require_admin, function(req, res) {
    res.render('admin/jobs')});
  app.get('/admin/make_admin', middleware.require_admin, routes_admin.make_admin);
  app.get('/admin/invites', middleware.require_admin, routes_admin.invites);
  app.get('/admin/:org/:repo/job/:job_id', middleware.require_admin, routes_admin.job);

  app.get('/account', middleware.require_auth_browser, routes.account);
  app.get('/add_repo', middleware.require_auth_browser, function(req, res) { res.render('add_repo'); });

  /* Requires at least read-only access to the repository in the path */
  app.get('/:org/:repo/latest_build', middleware.require_auth_browser, middleware.require_resource_read,
    routes_jobs.latest_build);
  app.get('/:org/:repo/', middleware.require_auth_browser, middleware.require_resource_read,
    routes_jobs.latest_build);
  app.get('/:org/:repo/job/:job_id', middleware.require_auth_browser, middleware.require_resource_read,
    routes_jobs.job);

  /* Requires admin access to the repository in the path */
  app.get('/:org/:repo/config',middleware.require_auth_browser, middleware.require_resource_admin,
    routes.config);

  app.post('/webhook', routes.webhook_signature);
  app.post('/webhook/:secret',routes.webhook_secret);

  app.get('/kickoff/:githubId', middleware.require_auth, routes.kickoff);
  app.get('/manual_setup', middleware.require_auth, function(req,res) {res.render('manual_setup');});

  app.post('/api/github/manual_setup',
    middleware.require_auth,
    middleware.require_params(["github_url"]),
    api_github.post_manual_setup);
  app.get('/api/github/metadata', middleware.require_auth, api_github.github_metadata);
  app.post('/api/github/webhooks/unset', middleware.require_auth, api_github.github_webhooks_unset);

  app.get('/api/admin/jobs', middleware.require_admin, api_admin.admin_jobs_status);
  app.get('/api/admin/users', middleware.require_admin, api_admin.get_user_list);
  app.post('/api/admin/invite/new', middleware.require_admin, api.invite_new);

  // this should be app.del and delete should be removed from the end
  // that requires javascript on client side
  app.get('/:org/:repo/delete', middleware.require_resource_admin, routes.delete_project);

  app.get('/api/jobs', middleware.require_auth, api_jobs.jobs);
  app.post('/api/jobs/start', middleware.require_auth, api_jobs.jobs_start);
  app.post('/api/heroku/account_integration', middleware.require_auth, api_heroku.heroku_account_integration);
  app.post('/api/heroku/delivery_integration', middleware.require_auth, api_heroku.heroku_delivery_integration);
  app.post('/api/heroku/config', middleware.require_auth, middleware.require_params(["url"]), api_heroku.heroku_config);

  app.post('/api/account/password', middleware.require_auth, api_account.account_password);
  app.post('/api/account/email', middleware.require_auth, api_account.account_email);


  // collaborators
  app.get('/api/collaborators',
    middleware.require_auth,
    middleware.require_params(["url"]),
    api_collaborators.get_index);
  app.post('/api/collaborators',
    middleware.require_auth,
    middleware.require_params(["url", "email"]),
    api_collaborators.post_index);
  app.delete('/api/collaborators',
    middleware.require_auth,
    middleware.require_params(["url", "email"]),
    api_collaborators.delete_index);


  // webhooks
  app.get('/api/webhooks',
    middleware.require_auth,
    middleware.require_params(["url"]),
    api_webhooks.get_index);
  app.post('/api/webhooks',
    middleware.require_auth,
    middleware.require_params(["url", "target_url", "secret"]),
    api_webhooks.post_index);
  app.delete('/api/webhooks',
    middleware.require_auth,
    middleware.require_params(["url"]),
    api_webhooks.delete_index);

  // repo config
  app.get('/api/repo',
    middleware.require_auth,
    middleware.require_params(["url"]),
    api_repo.get_index);
  app.post('/api/repo',
    middleware.require_auth,
    middleware.require_params(["url", "active"]),
    api_repo.post_index);
  app.delete('/api/repo',
    middleware.require_auth,
    middleware.require_params(["url"]),
    api_repo.delete_index);


  mongoose_auth.helpExpress(app);

  app.dynamicHelpers({
    user_created_timestamp: function(req, res){
      var user_created_timestamp=0;
      if (req.user !== undefined)
      {
        user_created_timestamp = parseInt(req.user.id.substr(0,8),16);
      }
      return user_created_timestamp;
    },
  });


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

// Don't run if require()'d
if (!module.parent) {
  var config = require('./config');
  var app = init(config);
  // Custom 404 handler.
  // Run after extensions, which might load static middlewares.
  app.use(middleware.custom404);
  app.listen(8080);
  // Initialize socket.io
  websockets.init(app, session_store);
  backchannel.init();
  console.info("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
}

