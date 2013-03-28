/*
 * routes/index.js
 */

var BASE_PATH = "../lib/"

var _ = require('underscore')
  , Step = require('step')
  , common = require(BASE_PATH + 'common')
  , fs = require('fs')
  , gh = require(BASE_PATH + 'github')
  , jobs = require(BASE_PATH + 'jobs')
  , logging = require(BASE_PATH + 'logging')
  , User = require(BASE_PATH + 'models').User
  , Job = require(BASE_PATH + 'models').Job
  ;

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
          res.render('register', {code:code});
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

/*
 * GET /:org/:repo/config - project config page
 */
exports.config = function(req, res)
{
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
      var projectPanels = common.panels['project_config'];
      var r = {
         // May be undefined if not configured
         display_name: wrepo_config.display_name,
         repo_org: req.params.org,
         repo_name: req.params.repo,
         apresController: "/javascripts/apres/controller/project_config.js",
         apresParams: apresParams,
         panels: [],
      };
      // TODO: factor out this logic so other resource handlers can use it later
      if (projectPanels) {
        // For each panel, read contents from FS or execute callback to get HTML
        Step(
          function() {
            var group = this.group();
            projectPanels.forEach(function(p) {
              var cb = group();
              var f = function(err, res) {
                p.contents = res;
                cb(err, p);
              };
              // Panel sources can be a string which assumed to be a filesystem path
              // or a function which is assumed to take a callback argument.
              if (typeof(p.src) === 'string') {
                fs.readFile(p.src, 'utf8', f);
              } else if (typeof(p.src) === 'function') {
                p.src(f);
              }
            });
          },
          function(err, panels) {
            if (err) {
              console.error("Error loading panels: %s", err);
              res.statusCode = 500;
              return res.end("Error handling request");
            }
            r.panels = panels;
            return res.render('project_config.html', r);
          }
        );
      } else {
        return res.render('project_config.html', r);
      }
    }
  );
};




/*
 * POST /webhook - Github push webhook handler
 */
exports.webhook_signature = function(req, res)
{
  gh.verify_webhook_req_signature(req, function(isOk, repo, user, payload) {
    var active = false;
    // Repo can be undefined
    if (isOk && repo) {
      active = repo.active;
    }
    // Default to active if property is missing.
    if (active === undefined) {
      active = true;
    }
    if (active && isOk && gh.webhook_commit_is_to_master(payload)) {
      console.log("received a correctly signed webhook for repo %s on master branch - starting task on user %s's behalf", repo.url, user.email);
      var github_commit_id = payload.after;
      var github_commit_info = gh.webhook_extract_latest_commit_info(payload);
      var repo_metadata = _.find(user.github_metadata[user.github.id].repos, function(item) {
        return repo.url == item.html_url.toLowerCase();
      });
      var repo_ssh_url;
      if (repo_metadata) {
        repo_ssh_url = repo_metadata.ssh_url;
      }
      console.debug("POST to Github /webhook payload: %j", payload);
      if (repo.has_prod_deploy_target) {
        var deploy_config = _.find(user[repo.prod_deploy_target.provider], function(item) {
          return item.account_id === repo.prod_deploy_target.account_id;
        });
        jobs.startJob(user, repo, deploy_config, github_commit_info, repo_ssh_url, TEST_AND_DEPLOY);
      } else {
        jobs.startJob(user, repo, deploy_config, github_commit_info, repo_ssh_url, TEST_ONLY);
      }
      res.end("webhook good");
    } else {
      console.log("received an incorrecly signed webhook or is not to master branch.");
      res.end("webhook bad or irrelevant");
    }
 });
};

exports.webhook_secret = function(req, res)
{
  gh.verify_webhook_req_secret(req, function(isOk, repo, user, payload) {
    var active = repo.active;
    // Default to active if property is missing.
    if (active === undefined)
      active = true;
    if (active && isOk && gh.webhook_commit_is_to_master(payload)) {
      console.log("received a correctly signed webhook for repo %s on master branch - starting task on user %s's behalf", repo.url, user.email);
      var github_commit_id = payload.after;
      var github_commit_info = gh.webhook_extract_latest_commit_info(payload);
      var repo_metadata = _.find(user.github_metadata[user.github.id].repos, function(item) {
        return repo.url == item.html_url.toLowerCase();
      });
      var repo_ssh_url = repo_metadata.ssh_url;
      console.debug("POST to Github /webhook payload: %j", payload);
      if (repo.has_prod_deploy_target) {
        var deploy_config = _.find(user[repo.prod_deploy_target.provider], function(item) {
          return item.account_id === repo.prod_deploy_target.account_id;
        });
        jobs.startJob(user, repo, deploy_config, github_commit_info, repo_ssh_url, TEST_AND_DEPLOY);
      } else {
        jobs.startJob(user, repo, deploy_config, github_commit_info, repo_ssh_url, TEST_ONLY);
      }
      res.end("webhook good");
    } else {
      console.log("gh: " + gh.webhook_commit_is_to_master(payload));
      console.log("received an incorrecly signed webhook or is not to master branch.");
      res.end("webhook bad or irrelevant");
    }
 });
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

