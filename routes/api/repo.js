/*
 * Repo-specific actions - such as deactivation, deletion etc.
 * routes/api/repo.js
 */


var BASE_PATH = '../../lib/';

var _ = require('underscore')
  , logging = require(BASE_PATH + 'logging')
  , ssh = require(BASE_PATH + 'ssh')
  , common = require(BASE_PATH + 'common')
  , User = require(BASE_PATH + 'models').User
  , Project = require(BASE_PATH + 'models').Project
  , Job = require(BASE_PATH + 'models').Job
  , Step = require('step')
  , async = require('async')
  ;

/*
 * GET /api/repo
 *
 * @param url Url of repository to look up.
 *

exports.get_index = function(req, res) {

  var url = req.param("url");
  var active = req.param("active");

  function error(err_msg) {
    console.error("repo.get_index() - %s", err_msg);
    var r = {
      errors: [err_msg],
      status: "error"
    };
    res.statusCode = 400;
    return res.end(JSON.stringify(r, null, '\t'));
  }

  function ok(record) {
    var r = {
      errors: [],
      status: "ok",
      results: [record]
    };
    res.statusCode = 200;
    return res.end(JSON.stringify(r, null, '\t'));
  }

  Step(
    function() {
        req.user.get_repo_config(url, this);
    },
    function(err, repo_config, my_access_level, owner_object) {
      if (err) {
        return error("Error fetching Repo Config for url " + url + ": " + err);
      }
      return ok({active: repo_config.active, url:repo_config.url});
    }
  );
};
 */

// XXX: "active" is now a per-branch variable. Do we modify this endpoint? Is it still needed?
/*
 * POST /api/repo
 *
 * @param url Url of repository to modify.
 * @param active Boolean specifying whether repo is active or not.
 *
 * Requires admin privileges.
exports.post_index = function(req, res) {

  var url = req.param("url");
  var active = req.param("active");

  function error(err_msg) {
    console.error("repo.post_index() - %s", err_msg);
    var r = {
      errors: [err_msg],
      status: "error"
    };
    res.statusCode = 400;
    return res.end(JSON.stringify(r, null, '\t'));
  }
  function ok() {
    var r = {
      errors: [],
      status: "ok",
      results: []
    };
    res.statusCode = 200;
    return res.end(JSON.stringify(r, null, '\t'));
  }

  if (active == "1" || active.toLowerCase() == "true") {
    active = true;
  } else if (active == "0" || active.toLowerCase() == "false") {
    active = false;
  } else {
    return error("'active' must be one of 1, true, 0, false");
  }

  Step(
    function() {
        req.user.get_repo_config(url, this);
    },
    function(err, repo_config, my_access_level, owner_object) {
      if (err) {
        return error("Error fetching Repo Config for url " + url + ": " + err);
      }
      // must have access_level > 0 to be able to continue;
      if (my_access_level < 1) {
        console.debug("User %s tried to modify activation state of a repo but doesn't have admin privileges on %s (access level: %s)",
          req.user.email, url, my_access_level);
        return error("You must have access level greater than 0 in order to be able to modify activation state.");
      }
      repo_config.active = active;
      owner_object.save(this);
    },
    function(err, repo) {
      if (err) {
        console.error("repo.post_index() - Error modifying active state for url %s by user %s: %s", url, req.user.email, err);
        return error("Error modifying active state for url " + url);
      }
      return ok();
    }
  );
};
 */

function defaultVal(val) {
  if (val === String) return ''
  if (val === Number) return 0
  if (Array.isArray(val)) return []
  if (val === Boolean) return false
  if (val.type && !val.type.type) {
    if (val.default) return val.default
    if (val.enum) return val.enum[0]
    return defaultVal(val.type)
  }
  if ('object' === typeof val) return defaultSchema(val)
  return null
}

function defaultSchema(schema) {
  var data = {}
    , val
  for (var key in schema) {
    data[key] = defaultVal(schema[key])
  }
  return data
}

function makePlugins(plugins) {
  var plugin
    , configs = []
  for (var i=0; i<plugins.length; i++) {
    plugin = common.extensions.job[plugins[i]]
    if (!plugin) return false
    configs.push({
      id: plugins[i],
      enabled: true,
      config: defaultSchema(plugin.config)
    })
  }
  return configs
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
 * *provider_id* - id of provider plugin
 * *account* - id of provider account
 * *repo_id* - id of the repo
 */
exports.create_project = function(req, res) {
  var name = req.params.org + '/' + req.params.repo

  console.log(req.body)
  console.log(req.text)
  console.log(req)
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

  if (!display_url) {
    return error(400, "display_url is required")
  }

  if (!provider || !provider.id) {
    return error(400, "provider.id is required")
  }

  if (!provider.account) {
    return error(400, "provider.account is required")
  }

  if (!provider.repo_id) {
    return error(400, "provider.repo_id is required")
  }

  if (!common.project_types[project_type]) {
    return error(400, "Invalid project type specified")
  }

  var plugins = makePlugins(common.project_types[project_type])
  if (!plugins) {
    return error(400, "Project type specified is not available; one or more required plugins is not installed")
  }

  Project.findOne({name: name.toLowerCase()}, function(err, project) {
    if (project) {
      console.error("User %s tried to create project for repo %s, but it already exists",
        req.user.email, name)

      return error(409, "project already exists")
    }
    ssh.generate_keypair(name + '-' + req.user.email, function (err, pubkey, privkey) {
      if (err) return error(500, 'Failed to generate ssh keypair')
      var p = new Project()
      p.name = name
      p.display_name = display_name
      p.display_url = display_url
      p.public = public
      // TODO generate a secret?
      p.prefetch_config = prefetch_config
      p.creator = req.user._id
      p.provider = provider
      p.branches = [{
        name: 'master',
        active: true,
        mirror_master: false,
        deploy_on_green: true,
        pubkey: pubkey,
        privkey: privkey,
        plugins: makePlugins(common.project_types[project_type].plugins),
        runner: {
          id: 'simple-runner',
          config: {
            pty: false
          }
        }
      }]
      p.save(function(err, ok) {
        if (err) {
          console.error("Error creating repo %s for user %s: %s", name, req.user.email, err)
          return error(500, "internal server error")
        }
        User.update({_id: req.user._id}, {$push: {projects: {name: name, display_name: p.display_name, access_level: 2}}}, function (err, num) {
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
        });
      })
    })
  })
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

