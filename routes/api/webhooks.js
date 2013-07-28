/*
 * routes/api/webhooks.js
 */

var BASE_PATH = '../../lib/';

var _ = require('underscore')
  , crypto = require('crypto')
  , check = require('validator').check
  , Step = require('step')
  , logging = require(BASE_PATH + 'logging')
  , User = require(BASE_PATH + 'models').User
  ;

/*
 * POST /api/webhooks
 *
 * Create a new webhook which will be fired on each test run.
 *
 * @param url Repo URL to configure webhook for (required)
 * @param target_url to send webhook to (required)
 * @param type Type of webhook - one of: "test"
 * @param title Title of the webhook
 * @param secret Shared secret to use to generate the HMAC-SHA1
 * signature. (required)
 */
exports.post_index = function(req, res) {
  var url = req.param("url");
  var target_url = req.param("target_url");
  var title = req.param("title");
  var secret = req.param("secret");
  var type = req.param("type") || "test";

  function error(err_msg) {
    console.error("webhooks.post_index() - %s", err_msg);
    var r = {
      errors: [err_msg],
      status: "error"
    };
    res.statusCode = 400;
    return res.end(JSON.stringify(r, null, '\t'));
  }
  function ok(id) {
    var r = {
      errors: [],
      status: "ok",
      id: id
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
      this.repo_config = repo_config;
      this.access_level = my_access_level;
      // must have access_level > 0 to be able to continue;
      if (my_access_level < 1) {
        console.debug("User %s tried to create a webhook but doesn't have admin privileges on %s (access level: %s)",
          req.user.email, url, my_access_level);
        return error("You must have access level greater than 0 in order to be able to create webhooks.");
      }
      var new_webhook = {
        url:target_url,
        title:title,
        secret:secret,
        type:type
      };
      repo_config.webhooks.push(new_webhook);
      this.hook_id = repo_config.webhooks[repo_config.webhooks.length - 1]._id;
      owner_object.save(this);
    },
    function(err, owner) {
      if (err) {
        console.error("webhooks.post_index() - Error adding webhook to url %s by user %s: %s", url, req.user.email, err);
        return error("Error adding webhook to url " + url);
      }
      return ok(this.hook_id);
    }
  );
};

/*
 * GET /api/webhooks
 *
 * Return list of webhooks configured for specified repo URL.
 *
 * @param url Repo URL (required)
 * 
 */
exports.get_index = function(req, res) {
  var url = req.param("url");

  function error(err_msg) {
    console.error("webhooks.get_index() - %s", err_msg);
    var r = {
      errors: [err_msg],
      status: "error"
    };
    res.statusCode = 400;
    return res.end(JSON.stringify(r, null, '\t'));
  }

  Step(
    function() {
        req.user.get_repo_config(url, this);
    },
    function(err, repo, my_access_level, owner_user_obj) {
      if (err) {
        return error("Error fetching Repo Config for url " + url + ": " + err);
      }
      // must have access_level > 0 to be able to continue;
      if (my_access_level < 1) {
        console.debug("User %s tried to retrieve webhooks but doesn't have admin privileges on %s (access level: %s)",
          req.user.email, url, my_access_level);
        return error("You must have access level greater than 0 in order to be able to retrieve webhooks.");
      }
      // Build a whitelist to output directly as JSON
      var whitelist = [];
      _.each(repo.webhooks, function(w) {
        whitelist.push({
          type: w.type,
          url: url,
          target_url: w.url,
          title: w.title,
          webhook_id: w._id.toString(),
          secret: w.secret
        });
      });
      var r = {
        status: "ok",
        errors: [],
        results: whitelist
      };
      return res.end(JSON.stringify(r, null, '\t'));
    }
  );


};

/*
 * DELETE /api/webhooks
 *
 * Return list of webhooks configured for specified repo URL.
 *
 * @param url Repo URL (required)
 * @param webhook_id ID of the webhook to remove (require)
 * 
 */
exports.delete_index = function(req, res) {
  var url = req.param("url");
  var webhook_id = req.param("webhook_id");

  function error(err_msg) {
    console.error("webhooks.delete_index() - %s", err_msg);
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
    function(err, repo_config, my_access_level, repo_owner) {
      if (err) {
        var err_msg = "Error fetching RepoConfig for url " + url + ": " + err;
        return error(err_msg);
      }
      this.repo_config = repo_config;
      this.access_level = my_access_level;
      this.repo_owner = repo_owner;
      // must have access_level > 0 to be able to continue;
      if (my_access_level < 1) {
        console.debug("User %s tried to delete a webhook but doesn't have admin privileges on %s (access level: %s)",
          req.user.email, url, my_access_level);
        return error("You must have access level greater than 0 in order to be able to delete webhooks.");
      }
      User.update({"github_config.url":url},
        {$pull:{"github_config.$.webhooks":{"_id":webhook_id}}}, this);
    },
    function deleteWebhook(err, num_affected) {
      if (err) {
        console.error("Error deleting webhook by user %s on repo %s: %s", req.user.email, webhook_id, err);
        return error("Could not delete webhook");
      }
      return ok();
    }
  );

};
