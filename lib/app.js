/**
 * The Strider (web) app.
 */

var Backchannel = require('./backchannel')
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
  , api_branches = require('../routes/api/branches')
  , api_jobs = require('../routes/api/jobs')
  , api_repo = require('../routes/api/repo')
  , api_config = require('../routes/api/config')
  , api_session = require('../routes/api/session')

  , auth = require('./auth')

  , path = require('path')
  , swig = require('swig')
  , pluginTemplates = require('./pluginTemplates')

  , cors = require('cors')
  , pjson = require('../package.json')

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
    require('./views-test')(app);
    app.use(express.logger('dev'))
  })

  app.configure(function(){
    app.set('views', path.join(__dirname, '..', 'views'));

    app.set('view engine', 'jade');
    app.engine('jade', require('jade').__express);
    app.engine('html', pluginTemplates.engine);

    if (config.cors) {
      app.use(cors(config.cors));
    }

    app.use(middleware.bodySetter);
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.compress());
    app.use(express.methodOverride());
    app.use(express.favicon(path.join(__dirname, '..', 'public', 'favicon.ico'), { maxAge: 2592000000 }));
    app.use(require('stylus').middleware({ src: path.join(__dirname, '..', 'public') }));

    app.use(express.session({
      secret: config.session_secret, store: session_store,
      cookie: {maxAge: MONTH_IN_MILLISECONDS}
    }));
    app.use(require('connect-flash')())

    app.use(function(req, res, next){
      res.locals.models = models;
      next();
    })

    auth.setup(app); // app.use(passport) is included

    app.use('/bower_components', express.static(path.join(__dirname, '..', 'bower_components'), {maxAge: MONTH_IN_MILLISECONDS}));
    app.use(express.static(path.join(__dirname, '..', 'dist'), {maxAge: MONTH_IN_MILLISECONDS}));
    app.use(express.static(path.join(__dirname, '..', 'public'), {maxAge: MONTH_IN_MILLISECONDS}));

    if (!config.smtp) {
      console.warn('No SMTP creds - forgot password flow will not work');
    }

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

  // Compiled plugin config assets
  app.get('/scripts/plugin-config-compiled.js', api_config.server('config', 'js'))
  app.get('/styles/plugin-config-compiled.css', api_config.server('config', 'css'))
  app.get('/scripts/account-plugins-compiled.js', api_config.server('account', 'js'))
  app.get('/styles/account-plugins-compiled.css', api_config.server('account', 'css'))
  app.get('/scripts/plugin-status-compiled.js', api_config.server('status', 'js'))
  app.get('/styles/plugin-status-compiled.css', api_config.server('status', 'css'))

  // Docs page (single page for moment)
  app.get('/docs', function(req, res) {res.render('docs');});
  app.get('/docs/getting_started', function(req, res) {res.render('docs/GettingStarted');});
  app.get('/docs/why_heroku_api_key', function(req, res) {res.render('docs/whyHerokuAPIKey');});

  app.get('/admin/projects', auth.requireAdminOr401, routes_admin.projects);
  app.get('/admin/users', auth.requireAdminOr401, routes_admin.users);
  app.get('/admin/jobs', auth.requireAdminOr401, function(req, res) {
    res.render('admin/jobs.html', {
      version: pjson.version
    })
  });
  app.get('/admin/make_admin', auth.requireAdminOr401, routes_admin.make_admin);
  app.post('/admin/remove_user', auth.requireAdminOr401, routes_admin.remove_user);
  app.get('/admin/invites', auth.requireAdminOr401, routes_admin.invites);
  app.get('/admin/:org/:repo/job/:job_id', auth.requireAdminOr401, routes_admin.job);

  app.get('/account', auth.requireUser, routes.account);
  app.get('/projects', auth.requireUser, routes.get_projects);
  app.post('/projects', auth.requireUser, routes.post_projects);

  /* Requires at least read-only access to the repository in the path */
  app.get('/:org/:repo/', middleware.project, routes_jobs.html);
  app.put('/:org/:repo/', auth.requireUser, api_repo.create_project);
  app.get('/:org/:repo/job/:job_id?', middleware.project, routes_jobs.multijob);
  app.get('/:org/:repo/jobs/', middleware.project, routes_jobs.jobs);
  app.post('/:org/:repo/start', auth.requireUser, middleware.project, auth.requireProjectAdmin, api_jobs.jobs_start);
  app.del('/:org/:repo/cache', auth.requireUser, middleware.project, auth.requireProjectAdmin, api_repo.clear_cache);

  app.del('/:org/:repo/', middleware.project, auth.requireProjectAdmin, api_repo.delete_project);

  // provider
  app.all('/:org/:repo/provider/',
          auth.requireUserOr401,
          middleware.project,
          auth.requireProjectAdmin)
  app.get('/:org/:repo/provider/', routes.getProviderConfig)
  app.post('/:org/:repo/provider/', routes.setProviderConfig)

  // collaborators
  app.all('/:org/:repo/collaborators/',
          auth.requireUserOr401,
          middleware.project,
          auth.requireProjectAdmin)
  app.get('/:org/:repo/collaborators/', api_collaborators.get);
  app.post('/:org/:repo/collaborators/', middleware.require_params(["email"]), api_collaborators.post);
  app.del('/:org/:repo/collaborators/', middleware.require_params(["email"]), api_collaborators.del);

  // branches
  app.all('/:org/:repo/branches/',
        auth.requireUserOr401,
        middleware.project,
        auth.requireProjectAdmin)
  app.post('/:org/:repo/branches/', middleware.require_params(["name"]), api_branches.post);
  app.put('/:org/:repo/branches/', middleware.require_params(["branches"]), api_branches.put);
  app.del('/:org/:repo/branches/', middleware.require_params(["name"]), api_branches.del);

  // keygen
  app.post('/:org/:repo/keygen/', auth.requireUser, middleware.project, auth.requireProjectAdmin, api.config.keygen);

  /* Requires admin access to the repository in the path */
  if ('development' === app.get('env')) {
    app.get('/:org/:repo/config(/*)', auth.requireUser, middleware.project, auth.requireProjectAdmin, routes.reloadConfig, routes.config);
  } else {
    app.get('/:org/:repo/config(/*)', auth.requireUser, middleware.project, auth.requireProjectAdmin, routes.config);
  }

  app.put('/:org/:repo/config', auth.requireUser, middleware.project, auth.requireProjectAdmin, routes.setConfig);

  app.all(
    '/:org/:repo/config/branch/runner(/*)',
    auth.requireUser,
    middleware.project,
    auth.requireProjectAdmin
  )
  app.get('/:org/:repo/config/branch/runner', routes.getRunnerConfig);
  app.put('/:org/:repo/config/branch/runner', routes.setRunnerConfig);
  app.put('/:org/:repo/config/branch/runner/id', routes.setRunnerId);
  app.all(
    '/:org/:repo/config/branch/:plugin',
    auth.requireUser,
    middleware.project,
    auth.requireProjectAdmin,
    middleware.projectPlugin
  )
  app.get('/:org/:repo/config/branch/:plugin', routes.getPluginConfig);
  app.put('/:org/:repo/config/branch/:plugin', routes.setPluginConfig);
  app.put('/:org/:repo/config/branch/', auth.requireUser, middleware.project, auth.requireProjectAdmin, routes.configureBranch)


  app.get('/api/admin/jobs', auth.requireAdminOr401, api_admin.admin_jobs_status);
  // XXX: We may only want to allow admin users to start jobs in the future (ie require_resource_auth middleware)
  // especially if we are doing more 'public dashboard' type deployments.
  app.get('/api/admin/users', auth.requireAdminOr401, api_admin.get_user_list);
  app.post('/api/admin/invite/new', auth.requireAdminOr401, api.invite_new);


  // app.get('/api/job/:id', api_jobs.raw);
  app.get('/api/jobs', auth.requireUserOr401, api_jobs.jobs);
  // app.get('/api/jobs/:org/:repo', middleware.project, api_jobs.repo_jobs);

  app.post('/api/account/password', auth.requireUserOr401, api_account.account_password);
  app.post('/api/account/email', auth.requireUserOr401, api_account.account_email);
  app.del('/api/account/:provider/:id', auth.requireUserOr401, api_account.remove);
  app.put('/api/account/:provider/:id', auth.requireUserOr401, api_account.save);

  app.get('/api/session', api_session.get);
  app.post('/api/session', api_session.create);

  app.get('/status', routes.status);

  app.post('/login', function (req, res, next) {

    if (!req.user) {
      return next();
    }

    res.redirect('/');
  }, auth.authenticate);
  app.get('/logout', auth.logout);
  app.get('/forgot', function (req, res) {
    res.render('forgot.html', {
      user: req.user,
      messages: req.flash('error')
    });
  });
  app.post('/forgot', auth.forgot);
  app.get('/reset/:token', auth.reset);
  app.post('/reset/:token', auth.resetPost);

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

  // Initialize socket.io
  var server = app.listen(config.port)
    , sockets = websockets.init(server, session_store)
    , back = new Backchannel(common.emitter, sockets)

  console.info("Express server listening on port %d in %s mode", config.port, app.settings.env);
};
