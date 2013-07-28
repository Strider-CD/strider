/*
 * routes/api/heroku.js
 */

var BASE_PATH = '../../lib/';

var _ = require('underscore')
  , Step = require('step')
  , User = require(BASE_PATH + 'models').User
  , api = require('./index.js')
  , check = require('validator').check
  , heroku = require(BASE_PATH + 'heroku')
  , logging = require(BASE_PATH + 'logging')
  ;


/*
 * POST /api/heroku/account_integration
 *
 * API wrapper for heroku.setup_account_integration() with an additional
 * step that retrieves the list of current apps under the account.
 *
 * Requires query param <api_key> which is the Heroku API key.
 * Returns the JSON response from Heroku apps list call.
 */
exports.heroku_account_integration = function(req, res) {
  var api_key;

  api_key = api.require_param("api_key", req, res);

  if (api_key === undefined) {
    return;
  }

  // Run Heroku account integration
  Step(
    function() {
      // List apps.
      heroku.api_call('/apps', api_key, this);
    }, function(e, r, b) {
      if (e) throw e;
      if (r.statusCode !== 200) {
        console.log('got', r.statusCode);
        res.statusCode = 500;
        res.end(JSON.stringify({status: "error", errors:null, errorCode: r.statusCode}));
        return;
      }
      // Response from this call is the Heroku list of apps.
      try {
        this.heroku_apps = JSON.parse(b)
      } catch (e) {
        // do nothing
      }
      // Do the account integration.
      heroku.setup_account_integration(req.user, api_key, this);
    }, function(e, user, account_id) {
      if (e) {
        console.error("heroku_account_integration() error for user %s: %j", req.user.email, e);
        throw e;
      }
      var data = {"status":"ok", "account_id":account_id, "heroku_apps":this.heroku_apps};
      res.end(JSON.stringify(data, null, '\t'));
    }
  );
};


/*
 * POST /api/heroku/delivery_integration
 *
 * API wrapper for heroku.setup_delivery_integration(). Will create the
 * new application if it doesn't already exist.
 *
 * Requires Heroku account_id, configured Github repo url and app name.
 */
exports.heroku_delivery_integration = function(req, res) {

  var account_id, gh_repo_url, app_name;
  var app_stack = "cedar";

  account_id = api.require_param("account_id", req, res);
  gh_repo_url = api.require_param("gh_repo_url", req, res);
  app_name = api.require_param("app_name", req, res);

  if (account_id === undefined
    || gh_repo_url === undefined
    || app_name === undefined) {
    return;
  }

  var heroku_config = _.find(req.user.heroku, function(item) {
    return item.account_id === account_id;
  });

  Step(
    function() {
      // Get list of existing apps
      heroku.api_call('/apps', heroku_config.get('api_key'), this);
      console.debug("Fetching list of existing Heroku apps for user %s", req.user.email);
    }, function(e, r, b) {
      if (e) throw e;
      var apps;
      try {
        apps = JSON.parse(b)
      } catch(e) {
        // do nothing
      }
      console.debug("Existing Heroku apps: %j", apps);
      var existing_app = _.find(apps, function(item) {
        return item.name === app_name;
      });
      // If necessary, create the app
      if (existing_app === undefined) {
        console.debug("App '%s' not found, creating", app_name);
        heroku.api_call('/apps', heroku_config.get('api_key'), this,
            {"app[name]":app_name,"app[stack]":app_stack}, "POST");
      } else {
        console.debug("App '%s' found, not creating", app_name);
        return null;
      }
    }, function(e, r, b) {
      if (e) throw e;
      if (r !== null && r.statusCode !== 202) {
        console.error("Problem (response status code: %s, response headers: %j) creating new app for user %s. Response body: %s", r.statusCode, r.headers, req.user.email, b);
        res.statusCode = 400;
        var data;
        try {
          data = JSON.parse(b);
        } catch (e) {
          data.error = "An unknown Heroku API error occurred when trying to create your app";
        }
        return res.end(JSON.stringify({status: "error", errors:[data.error]}));
      }
      if (r !== null) {
        console.debug("Successfully created app: '%s'", app_name);
      }
      heroku.setup_delivery_integration(req.user, account_id, gh_repo_url, app_name, this);
    }, function(err, user_obj) {
      if (err) {
        res.statusCode = 400;
        console.error("Error configuring Heroku delivery integration for user %s: %s", req.user.email, err);
        return res.end(JSON.stringify({status: "error", errors:[err]}));
      }
      return res.end(JSON.stringify({status: "ok", errors:[]}));
    }
  );

};


/*
 * POST /api/heroku/config
 *
 * Change Heroku settings for the supplied configured repository.
 *
 * <url> - (required) url of the repository
 * <deploy_on_green> - (optional) boolean for whether to deploy once tests pass successfully.
 * <unset_heroku> - (optional) boolean for whether to unset (delete) the Heroku config for this.
 */

exports.heroku_config = function(req, res)
{
  var url = req.param("url");

  function error(err_msg) {
    console.error("account.account_repo() - %s", err_msg);
    var r = {
      errors: [err_msg],
      status: "error"
    };
    res.statusCode = 400;
    return res.end(JSON.stringify(r, null, '\t'));
  };

  function ok() {
    var r = {
      errors: [],
      status: "ok",
      results: []
    };
    res.statusCode = 200;
    return res.end(JSON.stringify(r, null, '\t'));
  }

  req.user.get_repo_config(url, function(err, repo, access_level, owner) {
    if (err || !repo) {
      return error("Repo " + url + " not found. is it configured for this user?");
    }

    var deploy_on_green = req.param("deploy_on_green");
    if (deploy_on_green !== undefined
      && repo.has_prod_deploy_target) {
      if (deploy_on_green.toLowerCase() === "false" || deploy_on_green.toLowerCase() === "0") {
        repo.prod_deploy_target.deploy_on_green = false;
      } else if (deploy_on_green.toLowerCase() === "true" || deploy_on_green.toLowerCase() === "1") {
        repo.prod_deploy_target.deploy_on_green = true;
      }
      req.user.save(function() {
        return ok();
      });
      return;
    }

    var unset_heroku = req.param("unset_heroku");
    if (unset_heroku !== undefined
      && repo.has_prod_deploy_target) {
        req.user.get_prod_deploy_target(url, function(err, dt) {
          if (err || !dt) {
            return error("error fetching deploy target for url: " + url);
          }
          User.update({"github_config.url":url},
            {
              $pull:{heroku:{account_id:dt.account_id}},
              $unset:{"github_config.$.prod_deploy_target":1}
            }, function(err, num_affected) {
              if (err) {
                error("could not update repo config " + err);
              }
              ok();
          });
        });
        return;
    }
    ok();
  });
}

/*
 * POST /api/heroku/config
 *
 * Change Heroku settings for the given configured repository.
 *
 * <url> - (required) url of the repository
 * <deploy_on_green> - (optional) boolean for whether to deploy once tests pass successfully.
 * <unset_heroku> - (optional) boolean for whether to unset (delete) the Heroku config for this.
 */

exports.heroku_config = function(req, res)
{
  var url = req.param("url");

  function error(err_msg) {
    console.error("account.account_repo() - %s", err_msg);
    var r = {
      errors: [err_msg],
      status: "error"
    };
    res.statusCode = 400;
    return res.end(JSON.stringify(r, null, '\t'));
  };

  function ok() {
    var r = {
      errors: [],
      status: "ok",
      results: []
    };
    res.statusCode = 200;
    return res.end(JSON.stringify(r, null, '\t'));
  }

  req.user.get_repo_config(url, function(err, repo, access_level, owner) {
    if (err || !repo) {
      return error("Repo " + url + " not found. is it configured for this user?");
    }

    var deploy_on_green = req.param("deploy_on_green");
    if (deploy_on_green !== undefined
      && repo.has_prod_deploy_target) {
      if (deploy_on_green.toLowerCase() === "false" || deploy_on_green.toLowerCase() === "0") {
        repo.prod_deploy_target.deploy_on_green = false;
      } else if (deploy_on_green.toLowerCase() === "true" || deploy_on_green.toLowerCase() === "1") {
        repo.prod_deploy_target.deploy_on_green = true;
      }
      req.user.save(function() {
        return ok();
      });
      return;
    }

    var unset_heroku = req.param("unset_heroku");
    if (unset_heroku !== undefined
      && repo.has_prod_deploy_target) {
        req.user.get_prod_deploy_target(url, function(err, dt) {
          if (err || !dt) {
            return error("error fetching deploy target for url: " + url);
          }
          User.update({"github_config.url":url},
            {
              $pull:{heroku:{account_id:dt.account_id}},
              $unset:{"github_config.$.prod_deploy_target":1}
            }, function(err, num_affected) {
              if (err) {
                error("could not update repo config " + err);
              }
              ok();
          });
        });
        return;
    }
    ok();
  });
}
