// The Strider (web) app.

const debug = require('debug')('strider');
const chalk = require('chalk');
const express = require('express');
const EventEmitter = require('events').EventEmitter;
require('everypaas');

const cors = require('cors');
const path = require('path');
const swig = require('swig');

// middleware
const morganDebug = require('morgan-debug');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const expressSession = require('express-session');
const serveFavicon = require('serve-favicon');
const errorHandler = require('errorhandler');
const methodOverride = require('method-override');
const connectFlash = require('connect-flash');
const connectMongo = require('connect-mongo');

const setupDb = require('./utils/setup-db');
const Backchannel = require('./backchannel');
const common = require('./common');
require('./logging');
const middleware = require('./middleware');
const routes = require('./routes');
const providerRouter = require('./routes/provider');
const websockets = require('./websockets');
const models = require('./models');
const auth = require('./auth');
const pluginTemplates = require('./plugin-templates');
const pjson = require('../package.json');

const routesAdmin = require('./routes/admin');
const routesJobs = require('./routes/jobs');
const api = require('./routes/api');
const apiV2 = require('./routes/v2');
const collaboratorsRouter = require('./routes/collaborators');
const apiBranches = require('./routes/api/branches');
const apiJobs = require('./routes/api/jobs');
const apiRepo = require('./routes/api/repo');
const apiConfig = require('./routes/api/config');

const mongoStore = connectMongo(expressSession);
const MONTH_IN_MILLISECONDS = 2629743000;
const env = process.env.NODE_ENV || 'development';
const isDevelopment = env === 'development';
const isProduction = env === 'production';
const isTest = env === 'test';
let sessionStore;

exports.init = function (config) {
  const mongoose = setupDb(config, (err) => {
    if (err) {
      process.exit(1);
    }
  });

  sessionStore = new mongoStore({
    mongooseConnection: mongoose.connection,
  });

  swig.init({
    root: config.viewpath,
    // allows errors to be thrown and caught by express instead of suppressed by Swig
    allowErrors: true,
    cache: false,
    filters: require('./utils/swig-filters'),
    tags: require('./utils/swig-tags').tags,
    extensions: { plugin: pluginTemplates },
  });

  const app = express();

  if (isDevelopment) {
    app.use(morganDebug('strider:http', 'dev'));
  }

  if (isTest) {
    // awesome view testingness
    require('./views-test')(app);
  }

  // During development we build to an ignored file, only during release we do normal build
  const distDir = config.developing ? '.dev-dist' : 'dist';
  path.join(__dirname, '..', 'dist'),
    app.set('views', [
      path.join(__dirname, 'views'),
      config.developing && path.join(__dirname, '..', distDir),
      path.join(__dirname, '..', 'dist'),
    ]);
  app.engine('html', pluginTemplates.engine);

  if (config.cors) {
    app.use(cors(config.cors));
  }

  app.use(middleware.bodySetter);
  // parse application/x-www-form-urlencoded
  app.use(
    bodyParser.urlencoded({ extended: false, limit: config.body_parser_limit })
  );
  // parse application/json
  app.use(bodyParser.json({ limit: config.body_parser_limit }));
  app.use(cookieParser());
  app.use(compression());
  app.use(methodOverride());
  app.use(
    serveFavicon(path.join(__dirname, '..', 'public', 'favicon.ico'), {
      maxAge: 2592000000,
    })
  );

  app.use(
    expressSession({
      secret: config.session_secret,
      store: sessionStore,
      cookie: { maxAge: MONTH_IN_MILLISECONDS },
      resave: false,
      saveUninitialized: true,
    })
  );
  app.use(connectFlash());

  app.use(function (req, res, next) {
    res.locals.models = models;
    next();
  });

  auth.setup(app); // app.use(passport) is included

  app.use(
    '/vendor',
    express.static(path.join(__dirname, '..', 'vendor'), {
      maxAge: MONTH_IN_MILLISECONDS,
    })
  );
  app.use(
    express.static(path.join(__dirname, '..', 'dist'), {
      maxAge: MONTH_IN_MILLISECONDS,
    })
  );

  app.use(
    express.static(path.join(__dirname, '..', distDir, 'ember'), {
      maxAge: MONTH_IN_MILLISECONDS,
      index: false,
    })
  );

  app.use(
    express.static(path.join(__dirname, '..', 'public'), {
      maxAge: MONTH_IN_MILLISECONDS,
    })
  );

  if (!config.smtp) {
    debug('No SMTP creds - forgot password flow will not work');
  }

  // Routes

  apiV2.default(app);
  app.get('/', routes.index);

  app.get('/about', function (req, res) {
    res.render('about');
  });

  app.get('/status', routes.status);
  app.post(
    '/login',
    function (req, res, next) {
      if (!req.user) {
        auth.authenticate(function (err, user) {
          if (err) {
            return next(err);
          }
          if (!user) {
            return res
              .status(401)
              .json({ errors: ['Password incorrect or user does not exist'] });
          }
          req.login(user, function (err) {
            if (err) {
              return next(err);
            }
            return res.redirect('/');
          });
        })(req, res, next);
        return;
      }

      res.redirect('/');
    },
    auth.authenticate
  );
  app.get('/logout', auth.logout);
  app.post('/forgot', auth.forgot);
  app.get('/reset/:token', auth.reset);
  app.post('/reset/:token', auth.resetPost);

  // Compiled plugin config assets
  app.get(
    '/scripts/plugin-config-compiled.js',
    apiConfig.server('config', 'js')
  );
  app.get(
    '/styles/plugin-config-compiled.css',
    apiConfig.server('config', 'css')
  );
  app.get(
    '/scripts/account-plugins-compiled.js',
    apiConfig.server('account', 'js')
  );
  app.get(
    '/styles/account-plugins-compiled.css',
    apiConfig.server('account', 'css')
  );
  app.get(
    '/scripts/plugin-status-compiled.js',
    apiConfig.server('status', 'js')
  );
  app.get(
    '/styles/plugin-status-compiled.css',
    apiConfig.server('status', 'css')
  );

  app.get('/admin/projects', auth.requireAdminOr401, routesAdmin.projects);
  app.get('/admin/users', auth.requireAdminOr401, routesAdmin.users);
  app.get('/admin/jobs', auth.requireAdminOr401, function (req, res) {
    res.render('admin/jobs.html', {
      version: pjson.version,
    });
  });
  app.get('/admin/make_admin', auth.requireAdminOr401, routesAdmin.makeAdmin);
  app.post(
    '/admin/remove_user',
    auth.requireAdminOr401,
    routesAdmin.removeUser
  );
  app.get('/admin/invites', auth.requireAdminOr401, routesAdmin.invites);
  app.get(
    '/admin/:org/:repo/job/:job_id',
    auth.requireAdminOr401,
    routesAdmin.job
  );
  app.get('/admin/plugins', auth.requireAdminOr401, routesAdmin.plugins.get);
  app.put('/admin/plugins', auth.requireAdminOr401, routesAdmin.plugins.put);

  app.use('/account', auth.requireUser, require('./routes/account'));
  app.use('/projects', auth.requireUser, require('./routes/projects'));

  // Requires at least read-only access to the repository in the path
  // app.get('/:org/:repo/', middleware.project, routesJobs.html);
  app.put('/:org/:repo/', auth.requireUser, apiRepo.createProject);
  // app.get('/:org/:repo/job/:job_id?', middleware.project, routesJobs.multijob);
  app.get('/:org/:repo/jobs/', middleware.project, routesJobs.jobs);
  app.post(
    '/:org/:repo/start',
    auth.requireUser,
    middleware.project,
    auth.requireProjectAdmin,
    apiJobs.jobsStart
  );
  app.delete(
    '/:org/:repo/cache',
    auth.requireUser,
    middleware.project,
    auth.requireProjectAdmin,
    apiRepo.clearCache
  );

  app.delete(
    '/:org/:repo/',
    middleware.project,
    auth.requireProjectAdmin,
    apiRepo.deleteProject
  );

  // provider
  app.use(providerRouter);

  // collaborators
  app.use(collaboratorsRouter);

  // branches
  app.use(
    '/:org/:repo/branches/',
    auth.requireUserOr401,
    middleware.project,
    auth.requireProjectAdmin,
    apiBranches
  );

  // keygen
  app.post(
    '/:org/:repo/keygen/',
    auth.requireUser,
    middleware.project,
    auth.requireProjectAdmin,
    apiConfig.keygen
  );

  /* Requires admin access to the repository in the path */
  if ('development' === app.get('env')) {
    console.log('dev config');
    app.get(
      ['/:org/:repo/config', '/:org/:repo/config/'],
      auth.requireUser,
      middleware.project,
      auth.requireProjectAdmin,
      routes.reloadConfig,
      routes.config
    );
  } else {
    console.log('prod config');
    app.get(
      ['/:org/:repo/config', '/:org/:repo/config/'],
      auth.requireUser,
      middleware.project,
      auth.requireProjectAdmin,
      routes.config
    );
  }

  app.put(
    '/:org/:repo/config',
    auth.requireUser,
    middleware.project,
    auth.requireProjectAdmin,
    routes.setConfig
  );

  app.all(
    '/:org/:repo/config/branch/runner',
    auth.requireUser,
    middleware.project,
    auth.requireProjectAdmin
  );
  app.get('/:org/:repo/config/branch/runner', routes.getRunnerConfig);
  app.put('/:org/:repo/config/branch/runner', routes.setRunnerConfig);
  app.put('/:org/:repo/config/branch/runner/id', routes.setRunnerId);
  app.all(
    '/:org/:repo/config/branch/:plugin',
    auth.requireUser,
    middleware.project,
    auth.requireProjectAdmin,
    middleware.projectPlugin
  );
  app.get('/:org/:repo/config/branch/:plugin', routes.getPluginConfig);
  app.put('/:org/:repo/config/branch/:plugin', routes.setPluginConfig);
  app.put(
    '/:org/:repo/config/branch/',
    auth.requireUser,
    middleware.project,
    auth.requireProjectAdmin,
    routes.configureBranch
  );

  // app.get('/api/job/:id', apiJobs.raw);
  app.use('/api', api);
  app.get('/api/jobs', auth.requireUserOr401, apiJobs.jobs);
  // app.get('/api/jobs/:org/:repo', middleware.project, apiJobs.repoJobs);

  app.use(function (req, res, next) {
    let userCreatedTimestamp = 0;
    if (req.user !== undefined) {
      userCreatedTimestamp = parseInt(req.user.id.substr(0, 8), 16);
    }
    res.locals.user_created_timestamp = userCreatedTimestamp;
    next();
  });

  common.app = app;
  common.session_store = sessionStore;
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

exports.run = function (app) {
  const config = require('./config');

  app.get('/*', routes.emberIndex);

  if (isDevelopment) {
    app.use(errorHandler({ dumpExceptions: true, showStack: true }));
  }

  if (isProduction) {
    app.use(errorHandler({ dumpExceptions: true, showStack: false }));
  }

  // Custom 404 handler.
  // Run after extensions, which might load static middlewares.
  app.use(middleware.custom404);

  // Initialize socket.io
  const server = app.listen(config.port, config.host);
  const sockets = websockets.init(server, sessionStore);
  new Backchannel(common.emitter, sockets);

  console.log(
    chalk.green('Express server listening on port %s in %s mode'),
    config.port,
    app.settings.env
  );
};
