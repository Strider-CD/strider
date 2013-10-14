/*
 * routes/index.js
 */

var BASE_PATH = "../lib/"

var _ = require('underscore')
  , async = require('async')
  , Step = require('step')
  , fs = require('fs')
  , path = require('path')

  , utils = require(BASE_PATH + 'utils')
  , models = require(BASE_PATH + 'models')
  , common = require(BASE_PATH + 'common')
  , config = require(BASE_PATH + 'config')
  , jobs = require(BASE_PATH + 'jobs')
  , logging = require(BASE_PATH + 'logging')
  , models = require(BASE_PATH + 'models')
  , Project = models.Project
  , User = models.User
  , Job = models.Job
  , pjson = require('../package.json')
  , async = require('async')

var TEST_ONLY = "TEST_ONLY";
var TEST_AND_DEPLOY = "TEST_AND_DEPLOY";

/*
 * GET home page.
 */

exports.index = function(req, res){
  if (req.session.return_to) {
    var return_to = req.session.return_to
    req.session.return_to=null
    return res.redirect(return_to)
  }
  var code = ""
  if (req.param('code') !== undefined) {
    code = req.param('code')
    return res.render('register.html', {invite_code:code})
  }
  jobs.latestJobs(req.user, true, function (err, jobs) {
    res.render('index.html', {
      jobs: jobs,
      providers: common.userConfigs.provider
    })
  })
};


/* TODO: This is currently disabled. Do we need a kickoff at all?
 *
 * GET /kickoff  - start configuration wizard for a job
exports.kickoff = function(req, res, github) {
  var gh = github || gh;
  // Assert cached github metadata
  if (req.user.github_metadata === undefined
    || req.user.github_metadata[req.user.github.id] === undefined) {
    res.statusCode = 400;
    res.end("please call /api/github/metadata before this");
  } else {
    // Find the metadata for the repo we are kicking off on
    var kickoff_repo_metadata = req.user.get_repo_metadata(req.params.githubId);
    var trepo = whitelist_repo_metadata(kickoff_repo_metadata);
    // Check whether someone else has already configured this repository
    User.findOne({'github_config.url':trepo.url.toLowerCase()}, function(err, user) {
      if (!user) {
        res.render('kickoff.html', {repo: JSON.stringify(trepo)})
      } else {
        res.render('kickoff-conflict.html', {repo: JSON.stringify(trepo)});
      }
    });

  }
};
 */

/*
 * GET /account - account settings page
 */
exports.account = function(req, res){
  var hosted = {}
    , providers = common.userConfigs.provider
  for (var id in providers) {
    if (common.extensions.provider[id].hosted) {
      hosted[id] = providers[id]
    }
  }
  res.render('account.html', {
    user: utils.sanitizeUser(req.user.toJSON()),
    providers: hosted
  });
};

exports.setConfig = function (req, res) {
  var attrs = 'public'.split(' ')
  for (var i=0; i<attrs.length; i++) {
    if ('undefined' !== typeof req.body[attrs[i]]) {
      req.project[attrs[i]] = req.body[attrs[i]]
    }
  }
  req.project.save(function (err) {
    if (err) return res.send(500, 'failed to save project')
    res.send(200, 'saved')
  })
}

exports.getRunnerConfig = function (req, res) {
  var branch = req.project.branch(req.params.branch)
  res.send(branch.runner)
}

exports.setRunnerConfig = function (req, res) {
  var branch = req.project.branch(req.params.branch)
  branch.runner.config = req.body
  req.project.save(function (err, project) {
    if (err) return res.send(500, {error: 'Failed to save runner config'})
    res.send(project.branch(req.params.branch).runner.config)
  })
}

// GET /:org/:repo/config/:branch/:pluginname
// Output: the config
exports.getPluginConfig = function (req, res) {
  res.send(req.pluginConfig())
}

// POST /:org/:repo/config/:branch/:pluginname
// Set the configuration for a plugin on a branch. Output: the new config.
exports.setPluginConfig = function (req, res) {
  req.pluginConfig(req.body, function (err, config) {
    if (err) return res.send(500, {error: 'Failed to save plugin config'})
    res.send(config)
  })
}

exports.configureBranch = function (req, res) {
  var branch = req.project.branch(req.params.branch)
  if (!branch) {
    return res.send(400, 'Invalid branch')
  }
  if (req.body.plugin_order) {
    return setPluginOrder(req, res, branch);
  }
  var attrs = 'active privkey pubkey mirror_master deploy_on_green runner plugins'.split(' ')
  for (var i=0; i<attrs.length; i++) {
    if ('undefined' !== typeof req.body[attrs[i]]) {
      branch[attrs[i]] = req.body[attrs[i]]
    }
  }
  req.project.save(function (err) {
    if (err) return res.send(500, 'failed to save project')
    res.send(200, 'saved')
  })
}

function setPluginOrder(req, res, branch) {
  var plugins = req.body.plugin_order
    , old = branch.plugins || []
    , map = {}
    , i
  for (i=0; i<old.length; i++) {
    map[old[i].id] = old[i]
  }
  for (i=0; i<plugins.length; i++) {
    if (map[plugins[i].id]) {
      plugins[i].config = map[plugins[i].id].config
    } else {
      plugins[i].config = {}
    }
  }
  branch.plugins = plugins
  req.project.markModified('branches')
  req.project.save(function (err) {
    if (err) return res.send(500, 'Failed to save plugin config')
    res.send({success: true})
  })
}

exports.reloadConfig = function (req, res, next) {
  common.loader.initConfig(
    path.join(__dirname, 'public/javascripts/pages/config-plugins-compiled.js'),
    path.join(__dirname, 'public/stylesheets/css/config-plugins-compiled.css'),
    function (err, configs) {
      console.log('loaded config pages')
      common.pluginConfigs = configs
      common.loader.initUserConfig(
        path.join(__dirname, 'public/javascripts/pages/account-plugins-compiled.js'),
        path.join(__dirname, 'public/stylesheets/css/account-plugins-compiled.css'),
        function (err, configs) {
          console.log('loaded account config pages')
          common.userConfigs = configs
          next()
        })
    })
}

/*
 * GET /:org/:repo/provider
 */
exports.getProviderConfig = function (req, res) {
  res.send(req.project.provider.config)
}

exports.setProviderConfig = function (req, res) {
  var config = utils.validateAgainstSchema(req.body, common.extensions.provider[req.project.provider.id].config)
  _.extend(req.project.provider.config, config)
  req.project.markModified('provider.config')
  req.project.save(function (err, project) {
    if (err) return res.send(500, {error: 'Failed to save runner config'})
    res.send(project.provider.config)
  })
}

/*
 * GET /:org/:repo/config - project config page
 */
exports.config = function(req, res) {
  User.collaborators(req.project.name, 0, function (err, users) {
    var data = {
      collaborators: {},
      project: req.project.toJSON(),
      statusBlocks: common.statusBlocks
    }
    delete data.project.creator
    for (var i=0; i<users.length; i++) {
      var p = _.find(users[i].projects, function(p) {
        return p.name === req.project.name
      })
      data.collaborators[users[i].email] = p.access_level
    }
    data.provider = common.pluginConfigs.provider[req.project.provider.id]
    data.runners = common.pluginConfigs.runner
    data.plugins = common.pluginConfigs.job

    var provider = common.extensions.provider[req.project.provider.id]
    if (false && typeof provider.getBranches === 'function') {
      provider.getBranches(req.user.account(req.project.provider).config,
        req.project.provider.config, req.project, function(err, branches) {
          if (err) {
            console.error("could not fetch branches for repo %s: %s", req.project.name, err)
            return res.render('project_config.html', data)
          }
          var have = {}
            , newBranches = false
            , i
          for (i=0; i<req.project.branches.length; i++) {
            have[req.project.branches[i].name] = true
          }
          for (i=0; i<branches.length; i++) {
            if (have[branches[i]]) continue;
            newBranches = true
            req.project.branches.push({
              name: branches[i],
              mirror_master: true
            })
            data.project.branches.push({
              name: branches[i],
              mirror_master: true
            })
          }
          if (!newBranches) return res.render('project_config.html', data)
          
          Project.update({_id: req.project._id}, {$set: {branches: req.project.branches}}, function (err, project) {
            if (err || !project) console.error('failed to save branches')
            res.render('project_config.html', data)
          })
      })
    } else {
      res.render('project_config.html', data)
    }
  })
}

/*
 * /status endpoint
 * Executes a simple database query to verify that system is operational.
 * Assumes there is at least 1 user in the system.
 * Returns 200 on success.
 *
 * This is for use by Pingdom and similar monitoring systems.
 */
exports.status = function(req, res) {

  function error(message) {
    res.statusCode = 500;
    var resp = {
      status: "error",
      version: "StriderCD (http://stridercd.com) " + pjson.version,
      results: [],
      errors: [{message:message}]
    }
   return res.jsonp(resp)
  }

  function ok() {
    res.statusCode = 200;
    var resp = {
      status: "ok",
      version: "StriderCD (http://stridercd.com) " + pjson.version,
      results: [{message:"system operational"}],
      errors: []
    }
    return res.jsonp(resp)
  }

  User.findOne(function(err, user) {
    if (err) {
      return error("error retrieving user from DB: " + err);
    }
    if (!user) {
      return error("no users found in DB - mis-configured?")
    }
    return ok();
  });

};

function getDeep(obj) {
  return [].slice.call(arguments, 1).reduce(function (obj, name) {
    return obj && obj[name]
  }, obj)
}

function deepObj(obj) {
  var names = [].slice.call(arguments, 1)
  return names.reduce(function (obj, name) {
    return obj[name] || (obj[name] = {})
  }, obj)
}

function groupRepos(account, repomap, tree, repos) {
  var groups = deepObj(repomap, account.provider, account.id)
    , projectmap = getDeep(tree, account.provider, account.id) || {}
  for (var i=0; i<repos.length; i++) {
    if (!groups[repos[i].group]) {
      groups[repos[i].group] = {
        configured: 0,
        repos: []
      }
    }
    repos[i].project = projectmap[repos[i].id]
    groups[repos[i].group].repos.push(repos[i])
    if (repos[i].project) {
      groups[repos[i].group].configured += 1
    }
  }
}

function availableProjectTypes() {
  var available = {}
    , plugins
    , good
  for (var id in common.project_types) {
    good = true
    plugins = common.project_types[id].plugins
    for (var i=0; i<plugins.length; i++) {
      if (!common.extensions.job[plugins[i]]) {
        good = false
        break;
      }
    }
    if (good) {
      available[id] = common.project_types[id]
    }
  }
  return available
}

// GET /projects
// 
// This is where the "add project" flow starts.
exports.projects = function(req, res) {
  var tasks = []
    , repomap = {}
    , configured = {}
    , unconfigured = []
    , providers = common.userConfigs.provider

  Project.find({creator: req.user._id}).lean().exec(function (err, projects) {
    if (err) return res.send(500, 'Failed to get projects from the database')
    // tree is { providerid: { accountid: { repoid: project._id, ...}, ...}, ...}
    // to track which repos have been configured
    var tree = {}
      , account
    for (var i=0; i<projects.length; i++) {
      account = projects[i].provider
      deepObj(tree, projects[i].provider.id, projects[i].provider.account)[projects[i].provider.repo_id] = {
        _id: projects[i]._id,
        name: projects[i].name
      }
    }

    req.user.accounts.forEach(function (account) {
      configured[account.provider] = true

      // Caching
      var useCache = req.query.refresh !== account.provider && req.query.aid != account.id
      var haveCache = Array.isArray(account.cache) && account.cache.length > 0
      if (useCache && haveCache) {
        groupRepos(account, repomap, tree, account.toJSON().cache)
        return
      }

      tasks.push(function (next) {
        common.extensions.provider[account.provider].listRepos(account.config, function (err, repos) {
          if (err) return next(err)
          account.set('cache', repos)
          groupRepos(account, repomap, tree, repos)
          account.last_updated = new Date()
          next()
        })
      })
    })
    for (var id in providers) {
      if (configured[id] || !providers[id].setupLink) continue;
      unconfigured.push(providers[id])
    }
    async.parallel(tasks, function(err, r) {
      if (err) return res.send(500, 'Error while getting repos: ' + err.message + ':' + err.stack)
      // cache the fetched repos
      User.update({_id:req.user._id}, {$set:{accounts:req.user.toJSON().accounts}}, function(err, num) {
        if (err) console.error('error saving repo cache')
        if (!num) console.error("Didn't effect any users")
        console.log('Saved cache')
        // user is already be available via the "currentUser" template variable
        return res.render('projects.html', {
          unconfigured: unconfigured,
          providers: providers,
          repos: repomap,
          project_types: availableProjectTypes()
        });
      })
    })
  })
}

