
var _ = require('lodash');
var logging = require('./logging');
var auth = require('./auth');
var utils = require('./utils');
var common = require('./common');
var Project = require('./models').Project;

module.exports = {
  // Legacy aliases - don't use these:
  require_auth: auth.requireUserOr401,
  require_auth_browser: auth.requireUser,
  require_admin: auth.requireAdminOr401,
  require_project_admin: auth.requireProjectAdmin,

  bodySetter: bodySetter,
  require_params: requireParams,
  custom404: custom404,

  anonProject: anonProject,
  project: project,
  projectPlugin: projectPlugin,
  projectProvider: projectProvider
};

// Custom middleware to save unparsed request body to req.content
function bodySetter(req, res, next) {
  if (req._post_body) {
    return next();
  }

  req.post_body = req.post_body || '';

  if ('POST' !== req.method) {
    return next();
  }

  req._post_body = true;

  req.on('data', function(chunk) {
    req.post_body += chunk;
  });

  next();
}

// Require the specified parameters, or else return a 400 with a descriptive JSON body
function requireParams(paramsList) {
  return function(req, res, next) {
    var errors = [];
    var status = 'ok';
    var val, i;

    for (i = 0; i < paramsList.length; i++) {
      val = req.param(paramsList[i]);

      if (!val) {
        errors.push('required parameter `' + paramsList[i] + '` not found.');
        status = 'error';
      }
    }

    if (errors.length === 0) {
      next();
    } else {
      var r = {
        errors: errors,
        status: status
      };

      res.statusCode = 400;

      return res.end(JSON.stringify(r, null, '\t'));
    }
  }
}

function custom404(req, res, next) {
  if (req.method !== 'GET') {
    return next();
  }

  res.statusCode = 404;
  res.render('doesnotexist.html', 404);
}

// Create helper function to get or set the provifer config. Expects req.project
// `req.providerConfig` function
//   providerConfig() -> return the config
//   providerConfig(config, next(err)). save the config
//
// For hosted providers, the following function is also available
//   accountConfig() -> return the account confi
//   acountConfig(config, next(err)). save the account config
function projectProvider(req, res, next) {
  var project = req.project;
  var accounts, account;

  req.providerConfig = function (config, next) {
    if (arguments.length === 0) {
      return project.provider.config;
    }

    project.provider.config = config;
    project.markModified('provider');
    project.save(next);
  }
  // make this conditional?
  if (project.provider.account) {
    account = project.creator.account(project.provider.id, project.provider.account);

    req.accountConfig = function (config, next) {
      if (arguments.length === 0) {
        return account.config;
      }

      account.config = config;
      project.creator.markModified('accounts');
      project.creator.save(next);
    }
  }

  next();
}

// Get plugin config. Expects req.project
// Sets `req.pluginConfig` function
//   pluginConfig() -> return the config
//   pluginConfig(config, next(err)). save the config
function projectPlugin(req, res, next) {
  var pluginid;
  // if only 3 args, then get pluginid from params ":plugin"
  if (arguments.length === 4) {
    pluginid = req;
    req = res;
    res = next;
    next = arguments[3];
  } else {
    pluginid = req.params.plugin
  }

  var branch = req.project.branch(req.query.branch);
  var plugin = null

  if (!branch) {
    res.status(404);
    return res.send('Specified branch not found for the project');
  }
  // if it's just mirroring master
  if (branch.mirror_master) {
    res.status(400);
    return res.send('Branch not individually configurable');
  }

  for (var i = 0; i < branch.plugins.length; i++) {
    if (branch.plugins[i].id === pluginid) {
      plugin = branch.plugins[i];
      break;
    }
  }

  if (plugin === null) {
    res.status(404);
    return res.send('Plugin not enabled for the specified project');
  }

  req.pluginConfig = function (config, next) {
    if (arguments.length === 0) {
      return plugin.config;
    }

    plugin.config = config;
    req.project.markModified('branches');
    req.project.save(function (err, proj) {
      next(err, config);
    });
  }

  req.userConfig = function (config, next) {
    if (!req.user.isProjectCreator) {
      if (arguments.length === 0) {
        return false;
      }

      return next(new Error('Current user is not the creator - cannot set the creator config'));
    }

    if (arguments.length === 0) {
      return req.project.creator.jobplugins[pluginid];
    }

    var schema = common.userConfigs.job && common.userConfigs.job[pluginid];

    if (!schema) {
      return next(new Error('Plugin ' + pluginid + ' doesn\'t define any user config'));
    }

    config = utils.validateAgainstSchema(config, schema);
    // TODO: validation
    req.project.creator.jobplugins[pluginid] = config;
    req.project.creator.markModified('jobplugins');

    req.project.creator.save(function (err, user) {
      next(err, config);
    });
  }

  next();
}

// just link project but doesn't fail if there's no auth
function anonProject(req, res, next) {
  var name = req.params.org + '/' + req.params.repo;

  name = name.toLowerCase();

  Project.findOne({ name: name })
    .populate('creator')
    .exec(function (err, project) {
      if (err) {
        res.status(500);

        return res.send({
          error: 'Failed to find project',
          info: err
        });
      }

      if (!project) {
        res.status(404);
        return res.send('Project not found');
      }

      req.project = project;
      req.accessLevel = 0;

      var p

      if (req.user && req.user.projects) {
        p = _.find(req.user.projects, function (proj) {
          return proj.name === name;
        });
      }

      if (req.user && p && p.access_level > 0) {
        req.accessLevel = p.access_level;
      }

      next();
    })
}

// getProject Middleware
// assumes two url parameters, :org and :repo, and req.user
// checks user access level, and sets the following properties on the
// request object.
//
// req.project = the project
// req.accessLevel = 0 for public, 1 for normal, 2 for admin
//
// Errors:
//   404: not found
//   401: not public and you don't have access
//   500: something strange happened w/ the DB lookup
function project(req, res, next) {
  var name = req.params.org + '/' + req.params.repo;

  name = name.toLowerCase();

  Project.findOne({ name: name })
    .populate('creator')
    .exec(function (err, project) {
      if (err) {
        res.status(500);

        return res.send({ 
          error: 'Failed to find project',
          info: err
        });
      }

      if (!project) {
        res.status(404)
        return res.send('Project not found')
      }

      req.project = project;

      if (req.user && project.creator) {
        req.user.isProjectCreator = project.creator._id.toString() === req.user._id.toString()
      }

      var p;

      if (req.user && req.user.projects) {
        p = _.find(req.user.projects, function(proj) {
          return proj.name === name;
        });
      }

      if (req.user && p && p.access_level > 0) {
        req.accessLevel = p.access_level;
        return next();
      }

      if (req.user && req.user.account_level > 0) {
        req.accessLevel = 2;
        return next();
      }

      if (project.public) {
        req.accessLevel = 0;
        return next();
      }

      res.status(401);
      res.send('Not authorized');
    });
}
