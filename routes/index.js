/*
 * routes/index.js
 */

var BASE_PATH = "../lib/"

var _ = require('underscore')
  , Step = require('step')
  , fs = require('fs')
  , path = require('path')

  , models = require(BASE_PATH + 'models')
  , common = require(BASE_PATH + 'common')
  , config = require(BASE_PATH + 'config')
  , gh = require(BASE_PATH + 'github')
  , jobs = require(BASE_PATH + 'jobs')
  , logging = require(BASE_PATH + 'logging')
  , User = require(BASE_PATH + 'models').User
  , Job = require(BASE_PATH + 'models').Job
  , pjson = require('../package.json')
  , async = require('async')

var TEST_ONLY = "TEST_ONLY";
var TEST_AND_DEPLOY = "TEST_AND_DEPLOY";

/*
 * GET home page.
 */

exports.index = function(req, res){
  if (req.loggedIn == false){
  }
  if (req.session.return_to != null) {
    var return_to = req.session.return_to;
    req.session.return_to=null;
    res.redirect(return_to);
  } else {
    var code = "";
    if (req.param('code') !== undefined) {
      code = req.param('code');
          res.render('register.html', {invite_code:code});
    } else {
      if (req.user != undefined) {
        req.user.get_repo_config_list(function(err, repo_list) {
          if (err) throw err;
          res.render('index.html',{total_configured_projects:repo_list.length});
        });
      } else {
        res.render('index.html');
      }
    }

  }
};


function whitelist_repo_config(repo_config) {
  var trepo = {
    display_name:repo_config.display_url.replace(/^.*com\//gi, ''),
    display_url:repo_config.display_url,
    url:repo_config.url,
    project_type:repo_config.project_type,
    webhooks:repo_config.webhooks,
    prod_deploy_target:repo_config.deploy_target
  };
  return trepo;
}

function whitelist_repo_metadata(repo_metadata) {
  var trepo = {
    display_name:repo_metadata.html_url.replace(/^.*com\//gi, ''),
    url:repo_metadata.html_url,
    id:repo_metadata.id
  };
  return trepo;
}


/*
 * GET /kickoff  - start configuration wizard for a job
 */
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




/*
 * GET /account - account settings page
 */
exports.account = function(req, res){
  res.render('account.html');
};

exports.getPluginConfig = function (req, res) {
  res.send(req.pluginConfig())
}

exports.setPluginConfig = function (req, res) {
  req.pluginConfig(req.body, function (err, config) {
    if (err) return res.send({error: 'Failed to save plugin config'})
    res.send({success: true, config: config})
  })
}

/*
 * GET /:org/:repo/config - project config page
 */
exports.config = function(req, res) {
  Step(
    function() {
      req.user.get_repo_config(req.repo_url, this);
    },
    function(err, repo_config) {
      if (err) {
        console.error("config() - Error fetching repo config for user %s: %s", req.user.email, err);
        res.statusCode = 400;
        return res.end("Bad Request");
      }
      this.repo_config = repo_config;
      req.user.get_prod_deploy_target(repo_config.url, this);
    },
    function(err, deploy_target) {
      var wrepo_config = whitelist_repo_config(this.repo_config);
      var deploy_on_green = this.repo_config.prod_deploy_target.deploy_on_green;
      // Default to true if not set
      if (deploy_on_green === undefined) {
        deploy_on_green = true;
      }
      var deploy_target_name = null;
      if (deploy_target) {
        deploy_target_name = deploy_target.app;
      }
      var params = {
        repo_url: this.repo_config.url,
        has_deploy_target: deploy_target != null,
        deploy_target_name: deploy_target_name,
        deploy_on_green: deploy_on_green
      };
      var apresParams = JSON.stringify(params);

      var r = {
         // May be undefined if not configured
         display_name: wrepo_config.display_name,
         badge_url: config.strider_server_name + '/' + req.user.id + '/' + req.params.org + '/' + req.params.repo + '/badge',
         view_url: config.strider_server_name + '/' + req.params.org + '/' + req.params.repo,
         repo: wrepo_config,
         repo_org: req.params.org,
         repo_name: req.params.repo,
         apresParams: apresParams,
         panels: [],
         panelData: {}
      };
      var repo = this.repo_config


      var loadPanelContent = function(ext, cb){
        var panel = ext[1].panel
        var extName = ext[0]
        if (panel && panel.src){
          if (typeof(panel.src) === 'string') {
            try{
              panel.contents = fs.readFileSync(panel.src, 'utf8')
              return cb(null);
            } catch (e){
              // TODO - check error code
              panel.contents = fs.readFileSync(path.join(ext[1].dir,panel.src), 'utf8')
              return cb(null);
            }
          } else if (typeof(src) === 'function') {
            panel.src(function(err, content){
              panel.contents = content;
              return cb(null)
            })
          } else {
            cb("what is panel.src?")
          }

        }
        panel.contents = "<h1>Extension " + (ext[1].title || ext[0]) + " needs no configuration</h1>"
        return cb(null)
      }

      var loadPanelData = function(ext, cb){
        var extName = ext[0]
        if (ext[1].panel){
          var panel = ext[1].panel
          if (!panel.script_path) {
            panel.script_path = '/ext/' + extName + '/project_config.js'
          }
          if (typeof(panel.data) === 'function') {
            return panel.data(req.user, repo, models, function(err, data){
              r.panelData[extName] = data
              cb(null, ext[1])
            })
          } else if (panel.data !== undefined) {
            var data = {}
            if (Array.isArray(panel.data)) {
              panel.data.forEach(function (name) {
                data[name] = repo.get(name)
              })
              r.panelData[extName] = data
            } else if (typeof(panel.data) === 'string') {
              r.panelData[extName] = repo.get(panel.data)
            } else {
              r.panelData[extName] = panel.data
            }
            
            return cb(null, ext[1])
          }

          cb(null, panel)
        } else {
          // No Panel
          ext[1].panel = {}
          ext[1].id = ext[1].panel.id = ext[0]
          ext[1].title = ext[1].panel.title = ext[0]
          cb(null, ext[1])
        }
      }

      var loadExtensionPanels = function(ext, cb){
        loadPanelData(ext, function(err){
          if (err) throw err
          loadPanelContent(ext, function(err){
            if (err) throw err
            cb(null, ext[1].panel || ext[1])
          })
        })
      }

      var exts = [];
      for (var i in common.extensions){
        exts.push([i, common.extensions[i]])
      }

      async.map(exts, loadExtensionPanels, function(err, panels){
        if (err) {
          console.error("Error loading panels: %s", [err], new Error().stack);
          res.statusCode = 500;
          return res.end("Error handling request");
        }
        r.panels = panels;
        return res.render('project_config.html', r);
      
      })
    }
  );
};


/*
 * app.get('/:org/:repo/delete', middleware.require_resource_admin, routes.delete_project);
 * delete project. should be rewritten as backbone and api call
 * todo: should delete github webhook and deploy key
 * todo: should add 'archived' flag to jobs
 */

exports.delete_project = function(req,res) {
  var repo_url = "https://github.com/" + req.params.org + "/" + req.params.repo;
  repo_url = repo_url.toLowerCase();

  var conditions = { email: req.user.email }, update = {$pull : {github_config:{url:repo_url}}};
  User.update(conditions, update, function(err,numAffected) {
    if (err) throw err;
    console.log("deleted: " + repo_url);
    res.redirect("/");
  });
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
    return res.end(JSON.stringify(resp, null, "\t"));
  }

  function ok() {
    res.statusCode = 200;
    var resp = {
      status: "ok",
      version: "StriderCD (http://stridercd.com) " + pjson.version,
      results: [{message:"system operational"}],
      errors: []
    }
    return res.end(JSON.stringify(resp, null, "\t"));
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

