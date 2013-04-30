/*
 * Repo-specific actions - such as deactivation, deletion etc.
 * routes/api/repo.js
 */


var BASE_PATH = '../../lib/';

var _ = require('underscore')
  , logging = require(BASE_PATH + 'logging')
  , User = require(BASE_PATH + 'models').User
  , Job = require(BASE_PATH + 'models').Job
  , Step = require('step')
  ;

/*
 * GET /api/repo
 *
 * @param url Url of repository to look up.
 *
 */

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

/*
 * POST /api/repo
 *
 * @param url Url of repository to modify.
 * @param active Boolean specifying whether repo is active or not.
 *
 * Requires admin privileges.
 */

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


/*
 * DELETE /api/repo
 *
 * @param url Url of repository to delete. Also archives all jobs (marks as archived in DB which makes them hidden).
 *
 * Requires admin privs.
 */
exports.delete_index = function(req, res) {

  var url = req.param("url");

  function error(err_msg) {
    console.error("repo.delete_index() - %s", err_msg);
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
        console.debug("User %s tried to delete repo but doesn't have admin privileges on %s (access level: %s)",
          req.user.email, url, my_access_level);
        return error("You must have access level greater than 0 in order to be able to delete a repo.");
      }
      var now = new Date();
      // Remove the repo config
      User.update({"github_config.url":repo_config.url},
        {$pull:{"github_config":{"url":repo_config.url}}}, this.parallel());
      // Mark all jobs as "archived"
      Job.update({"repo_url":repo_config.url},
        {$set:{"archived_timestamp":now}}, {multi:true}, this.parallel());
    },
    function(err) {
      if (err) {
        console.error("repo.delete_index() - Error deleting repo config for url %s by user %s: %s", url, req.user.email, err);
        return error("Error deleteing repo: " + url);
      }
      return ok();
    }
  );

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

exports.getPlugins = function(req, res, next){
  var url = req.param("repo");

  Step(
    function() {
        req.user.get_repo_config(url, this);
    },
    function(err, repo_config, my_access_level, owner_object) {
      if (err) {
        return error("Plugins.get", "Error fetching Repo Config for url " + url + ": " + err, res);
      }
      return ok(repo_config.plugins, res);
    }
  );

}

exports.postPlugins = function(req, res, next){
}


