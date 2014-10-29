/*
 * Repo-specific actions - such as deactivation, deletion etc.
 * routes/api/repo.js
 */


var BASE_PATH = '../../';

var utils = require(BASE_PATH + 'utils')
  , common = require(BASE_PATH + 'common')
  , User = require(BASE_PATH + 'models').User
  , Project = require(BASE_PATH + 'models').Project
  , Job = require(BASE_PATH + 'models').Job
  , async = require('async')

  , keypair = require('ssh-keypair')

function makePlugins(plugins) {
  var plugin
    , configs = []
  for (var i=0; i<plugins.length; i++) {
    plugin = common.extensions.job[plugins[i]]
    if (!plugin) return false
    var config = utils.defaultSchema(plugin)
    configs.push({
      id: plugins[i],
      enabled: true,
      config: config
    })
  }
  return configs
}

/*
 * DELETE /:org/:repo/cache
 *
 * Kill the cache
 */
exports.clear_cache = function (req, res) {
  var runners = []
    , tasks = []
  req.project.branches.forEach(function (branch) {
    if ((branch.name !== 'master' && branch.mirror_master) || runners.indexOf(branch.runner.id) !== -1) return
    runners.push(branch.runner.id)
  })
  runners.forEach(function (rid) {
    var runner = common.extensions.runner[rid]
    console.log(rid, common.extensions.runner, req.project)
    if (!runner || !runner.clearCache) return
    tasks.push(runner.clearCache.bind(runner, req.project))
  })
  if (!tasks.length) return res.send(200, 'No runners supported cache clearing')
  async.parallel(tasks, function (err) {
    if (err) return res.send(500, 'failed to clear cache')
    res.send(204)
  })
}

/*
 * PUT /:org:/repo
 *
 * Create a new project for a repo.
 *
 * BODY arguments:
 *
 * *display_name* - humanly-readable project name
 * *display_url* - URL fir the repo (e.g. Github homepage)
 * *public* - boolean for whether this project is public or not. (default: false)
 * *prefetch_config* - boolean for whether the strider.json should be fetched in advance. (default: true)
 * *account* - id of provider account
 * *repo_id* - id of the repo
 * *provider* json object of {id: , config:
 */
exports.create_project = function(req, res) {
  var name = req.params.org + '/' + req.params.repo

  var account = req.body.account
  var display_name = req.body.display_name
  var display_url = req.body.display_url
  var public = req.body.public === 'true' || req.body.public === '1'
  var prefetch_config = true
  var project_type = req.body.project_type || 'node.js'
  if (req.body.prefetch_config === 'false' || req.body.prefetch_config === '0') {
    prefetch_config = false
  }
  var provider = req.body.provider

  function error(code, str) {
      return res.json(code,
          {results:[], status: "error", errors:[{code:code, reason:str}]})
  }

  if (!display_name) {
    return error(400, "display_name is required")
  }

  /** no it's not
  if (!display_url) {
    return error(400, "display_url is required")
  }
  **/

  if (!provider || !provider.id) {
    return error(400, "provider.id is required")
  }

  if (common.extensions.provider[provider.id].hosted) {
    if (!provider.account) {
      return error(400, "provider.account is required")
    }

    if (!provider.repo_id) {
      return error(400, "provider.repo_id is required")
    }
  }

  if (!provider.config) {
    provider.config = utils.defaultSchema(provider.config)
  }

  if (!common.project_types[project_type]) {
    return error(400, "Invalid project type specified")
  }

  var plugins = makePlugins(common.project_types[project_type].plugins)
  if (!plugins) {
    return error(400, "Project type specified is not available; one or more required plugins is not installed")
  }

  function projectResult(err, project) {
    if (project) {
      console.error("User %s tried to create project for repo %s, but it already exists",
        req.user.email, name)

      return error(409, "project already exists")
    }

    keypair(name + '-' + req.user.email, createProjectWithKey)
  }

  function createProjectWithKey(err, privkey, pubkey) {
    if (err) return error(500, 'Failed to generate ssh keypair')

    var project =
      { name: name
      , display_name: display_name
      , display_url: display_url
      , public: public
      , prefetch_config: prefetch_config
      , creator: req.user._id
      , provider: provider
      , branches:
        [
          { name: 'master'
          , active: true
          , mirror_master: false
          , deploy_on_green: true
          , pubkey: pubkey
          , privkey: privkey
          , plugins: plugins
          , runner:
            { id: 'simple-runner'
            , config: { pty: false }
            }
          }
        , { name: '*'
          , mirror_master: true
          }
        ]
      }

    var plugin = common.extensions.provider[provider.id]
    if (!plugin.hosted || !plugin.setupRepo) {
      return Project.create(project, projectCreated)
    }

    plugin.setupRepo(req.user.account(provider).config, provider.config, project, function (err, config) {
      if (err){
        console.log(err.message)
        console.log(err.stack)
        return error(500, 'Failed to setup repo: ' + err.message)
      }
      project.provider.config = config
      Project.create(project, projectCreated)
    })
  }

  function projectCreated(err, p) {
    if (err) {
      console.error("Error creating repo %s for user %s: %s", name, req.user.email, err)
      console.log(err.stack)
      return error(500, "internal server error")
    }
    // Project object created, add to User object
    User.update({_id: req.user._id},
        {$push:
            {projects: {
              name: name,
              display_name: p.display_name,
              access_level: 2}
            }
        },
      function (err, num) {
      if (err || !num) console.error('Failed to give the creator repo access...')
      return res.json({
        project: {
          _id: p._id,
          name: p.name,
          display_name: p.display_name
        },
        results:[{code:200, message:"project created"}],
        status: "ok",
        errors: []
      })
    })
  }

  name = name.toLowerCase().replace(/ /g, '-')
  Project.findOne({name: name}, projectResult)

}

/*
 * DELETE /:org/:repo
 *
 * @param url Url of repository to delete. Also archives all jobs (marks as archived in DB which makes them hidden).
 *
 * Requires admin privs.
 */
exports.delete_project = function(req, res) {
  async.parallel([
    function (next) {
      var provider = req.project.provider
        , plugin = common.extensions.provider[provider.id]
      if (!plugin.hosted || !plugin.teardownRepo) return next()
      plugin.teardownRepo(req.project.creator.account(provider).config, provider.config, req.project, function (err) {
        if (err) console.error('Error while tearing down repo', req.project.name, provider.id, err)
        next()
      })
    },
    req.project.remove.bind(req.project),
    function (next) {
      var now = new Date()
      Job.update({project: req.project.name},
                 {$set: {archived: now}},
                 {multi: true}, next)
    }
  ], function (err) {
    if (err) {
      console.error("repo.delete_index() - Error deleting repo config for url %s by user %s: %s", req.project.name, req.user.email, err);
      return res.send(500, 'Failed to delete project: ' + err.message)
    }
    var r = {
      errors: [],
      status: "ok",
      results: []
    };
    res.send(JSON.stringify(r, null, '\t'));
  })
};


var error = function(ctx, err_msg, res){
  console.error(ctx, err_msg);
  var r = {
    errors: [err_msg],
    status: "error"
  };
  res.statusCode = 400;
  return res.end(JSON.stringify(r, null, '\t'));
}

var ok = function(results, res){
  var r = {
    errors: [],
    status: "ok",
    results: results
  }
  res.statusCode = 200;
  return res.end(JSON.stringify(r, null, '\t'));
}

