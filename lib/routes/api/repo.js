'use strict';

/*
 * Repo-specific actions - such as deactivation, deletion etc.
 * routes/api/repo.js
 */

var async = require('async');
var common = require('../../common');
var debug = require('debug')('strider:routes:api:repo');
var Job = require('../../models').Job;
var Project = require('../../models').Project;
var ssh = require('./../../ssh');
var User = require('../../models').User;
var utils = require('../../utils');

function makePlugins(plugins) {
  var configs = [];
  var plugin;

  for (var i = 0; i < plugins.length; i++) {
    plugin = common.extensions.job[plugins[i]];

    if (!plugin) return false;

    var config = utils.defaultSchema(plugin);

    configs.push({
      id: plugins[i],
      enabled: true,
      config: config
    });
  }

  return configs;
}

/**
 * @api {delete} /:org/:repo/cache Clear Cache
 * @apiUse ProjectReference
 * @apiPermission ProjectAdmin
 * @apiDescription Clears/invalidates the cache for a project.
 * @apiName ClearCache
 * @apiGroup Repo
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} CURL Example:
 *    curl -X DELETE http://localhost/api/strider-cd/strider/cache
 */
exports.clearCache = function (req, res) {
  clearProjectCache(req.project, function (err, result) {
    if (err) {
      return res.status(500).send('failed to clear cache');
    }

    if (result) {
      res.send(result);
    } else {
      res.sendStatus(204);
    }
  });
};

function clearProjectCache(project, cb) {
  var runners = [];
  var tasks = [];

  project.branches.forEach(function (branch) {
    var nonMasterMirrored = branch.name !== 'master' && branch.mirror_master;

    if (nonMasterMirrored || runners.indexOf(branch.runner.id) !== -1) {
      return;
    }

    runners.push(branch.runner.id);
  });

  runners.forEach(function (rid) {
    var runner = common.extensions.runner[rid];

    debug(rid, common.extensions.runner, project);
    if (!runner || !runner.clearCache) return;
    tasks.push(runner.clearCache.bind(runner, project));
  });

  if (!tasks.length) {
    return cb(undefined, 'No runners supported cache clearing');
  }

  async.parallel(tasks, cb);
}

/**
 * @api {put} /:org Create Repo
 * @apiDescription Create a new project for a repo.
 * @apiName CreateRepo
 * @apiGroup Repo
 * @apiVersion 1.0.0
 *
 * @apiParam (RequestBody) {String} name The name of the new branch
 * @apiParam (RequestBody) {String} display_name Human-readable project name
 * @apiParam (RequestBody) {String} display_url The URL for the repo (e.g. Github homepage)
 * @apiParam (RequestBody) {Boolean} public=false Whether this project is public or not.
 * @apiParam (RequestBody) {Boolean} prefetch_config=true Whether the strider.json should be fetched in advance.
 * @apiParam (RequestBody) {String} account The ID of provider account
 * @apiParam (RequestBody) {String} repo_id The ID of the repo
 * @apiParam (RequestBody) {Object} provider A json object with 'id' and 'config' properties.
 */
exports.createProject = function (req, res, next) {
  if (req.params.org === 'auth') {
    return next();
  }

  var name = `${req.params.org}/${req.params.repo}`;
  debug(`Setting up new project "${name}"...`);

  var display_name = req.body.display_name;
  var display_url = req.body.display_url;
  var isPublic = req.body.public === 'true' || req.body.public === '1';
  var prefetch_config = true;
  var project_type = req.body.project_type || 'node.js';
  if (req.body.prefetch_config === 'false' || req.body.prefetch_config === '0') {
    prefetch_config = false;
  }
  var provider = req.body.provider;

  function error(code, str) {
    return res.status(code).json({
      results: [],
      status: 'error',
      errors: [{code: code, reason: str}]
    });
  }

  if (!display_name) {
    return error(400, 'display_name is required');
  }

  if (!provider || !provider.id) {
    return error(400, 'provider.id is required');
  }

  if (common.extensions.provider[provider.id].hosted) {
    if (!provider.account) {
      return error(400, 'provider.account is required');
    }

    if (!provider.repo_id) {
      return error(400, 'provider.repo_id is required');
    }
  }

  if (!provider.config) {
    provider.config = utils.defaultSchema(provider.config);
  }

  if (!common.project_types[project_type]) {
    return error(400, 'Invalid project type specified');
  }

  var plugins = makePlugins(common.project_types[project_type].plugins);
  if (!plugins) {
    return error(400, 'Project type specified is not available; one or more required plugins is not installed');
  }

  function projectResult(err, project) {
    if (project) {
      debug(`User ${req.user.email} tried to create project for repo ${name}, but it already exists`);

      return error(409, 'project already exists');
    }

    return ssh.generateKeyPair(`${name}-${req.user.email}`, createProjectWithKey);
  }

  function createProjectWithKey(err, privkey, pubkey) {
    if (err) return error(500, 'Failed to generate ssh keypair');

    var project = {
      name: name,
      display_name: display_name,
      display_url: display_url,
      public: isPublic,
      prefetch_config: prefetch_config,
      creator: req.user._id,
      provider: provider,
      branches: [
        {
          name: 'master',
          active: true,
          mirror_master: false,
          deploy_on_green: true,
          deploy_on_pull_request: false,
          pubkey: pubkey,
          privkey: privkey,
          plugins: plugins,
          runner: {
            id: 'simple-runner',
            config: {pty: false}
          }
        },
        {
          name: '*',
          mirror_master: true
        }
      ]
    };

    var plugin = common.extensions.provider[provider.id];
    if (!plugin.hosted || !plugin.setupRepo) {
      return Project.create(project, projectCreated);
    }

    debug(`Setting up repository "${project.name}" with provider "${provider.id}"...`);
    plugin.setupRepo(req.user.account(provider).config, provider.config, project, function (err, config) {
      if (err) {
        debug(`Setting up repository "${project.name}" failed!`, err.status, err.message);
        return error(500, `Failed to setup repo: ${err.message}`);
      }
      project.provider.config = config;
      Project.create(project, projectCreated);
    });
  }

  function projectCreated(err, p) {
    if (err) {
      debug(`Error creating repo ${name} for user ${req.user.email}: ${err}`);
      debug(err.stack);
      return error(500, 'internal server error');
    }
    // Project object created, add to User object
    User.update({_id: req.user._id}, {
      $push: {
        projects: {
          name: name,
          display_name: p.display_name,
          access_level: 2
        }
      }
    }, function (err, num) {
      if (err || !num) debug('Failed to give the creator repo access...');

      return res.json({
        project: {
          _id: p._id,
          name: p.name,
          display_name: p.display_name
        },
        results: [{code: 200, message: 'project created'}],
        status: 'ok',
        errors: []
      });
    });
  }

  name = name.toLowerCase().replace(/ /g, '-');
  Project.findOne({name: name}, projectResult);
};

/**
 * @api {delete} /:org/:repo Delete Repo
 * @apiUse ProjectReference
 * @apiPermission ProjectAdmin
 * @apiDescription Deletes a repository/project. Also archives all jobs (marks as archived in DB which makes them hidden).
 * @apiName DeleteRepo
 * @apiGroup Repo
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} CURL Example:
 *    curl -X DELETE http://localhost/api/strider-cd/strider
 */
exports.deleteProject = function (req, res) {
  async.parallel([
    function (next) {
      var provider = req.project.provider;
      var plugin = common.extensions.provider[provider.id];
      if (!plugin.hosted || !plugin.teardownRepo) return next();
      plugin.teardownRepo(req.project.creator.account(provider).config, provider.config, req.project, function (err) {
        if (err) debug('Error while tearing down repo', req.project.name, provider.id, err);
        next();
      });
    },
    req.project.remove.bind(req.project),
    function (next) {
      clearProjectCache(req.project, function (error) {
        next(error);
      });
    },
    function (next) {
      var now = new Date();

      Job.update({project: req.project.name},
        {$set: {archived: now}},
        {multi: true}, next);
    }
  ], function (err) {
    if (err) {
      debug('repo.delete_index() - Error deleting repo config for url %s by user %s: %s', req.project.name, req.user.email, err);
      return res.status(500).send(`Failed to delete project: ${err.message}`);
    }
    var r = {
      errors: [],
      status: 'ok',
      results: []
    };
    res.send(JSON.stringify(r, null, '\t'));
  });
};
