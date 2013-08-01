var BASE_PATH = "../../../lib/";
var _ = require('underscore')
  , models = require(BASE_PATH + 'models')
  , crypto = require('crypto')
  , logging = require(BASE_PATH + 'logging')
  , nibbler = require(BASE_PATH + 'nibbler')
  , Step = require('step')
  , mail = require(BASE_PATH + 'email')
  ;

function email_to_gravatar(email) {
      var gravatar = 'https://secure.gravatar.com/avatar/'
        + crypto.createHash('md5').update(email).digest("hex")
        + 'd=identicon';

      return gravatar;
}

/*
 * GET /api/collaborators/
 *
 * Get the current list of collaborators for the Github repository.
 *
 * @param url Github html_url of the project.
 */
exports.get_index = function(req, res) {
  var url = req.param("url");

  function error(err_msg) {
    console.error("collaborators.get_index() - %s", err_msg);
    var r = {
      errors: [err_msg],
      status: "error"
    };
    res.statusCode = 400;
    return res.end(JSON.stringify(r, null, '\t'));
  };

  Step(
    function() {
        req.user.get_repo_config(url, this);
    },
    function(err, repo, access_level, owner_user_obj) {
      if (err) {
        return error("Error fetching Repo Config for url " + url + ": " + err);
      }
      this.collabs = repo.collaborators;
      this.owner_user_obj = owner_user_obj;
      // Look up emails for each collaborator
      var group = this.group();
      _.each(repo.collaborators, function(c) {
        models.User.findOne({"_id":c.user_id}, {"email":1}, group());
      });
    },
    function(err, results) {
      if (err) {
        return error("Error fetching collaborator emails: " + err);
      }
      // Build a whitelist to output directly as JSON
      var id_email_map = {};
      _.each(results, function(user) {
        id_email_map[user._id] = user.email;
      });
      var whitelist = [];
      _.each(this.collabs, function(c) {
        whitelist.push({
          type: "user",
          email: id_email_map[c.user_id],
          access_level: c.access_level,
          owner: false,
          gravatar: email_to_gravatar(id_email_map[c.user_id]),
        });
      });
      // Synthesize the owner as a collaborator
      whitelist.push({type:"user", user_id: this.owner_user_obj._id,
        access_level: 1, email: this.owner_user_obj.email, owner:true,
        gravatar: email_to_gravatar(this.owner_user_obj.email)});
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
 * POST /api/collaborators/
 *
 * Add a new collaborator for a Github repository. You must have admin privileges on the corresponding RepoConfig
 * to be able to use this endpoint.
 *
 * @param url Github html_url of the project.
 * @param email Email address to add. If the user is not registered with Strider, we will send them an invite. If
 * they are already registered, they will receive a notification of access.
 * @param access_level Access level to grant. 0 = read-only, 1 = admin (default: 0)
 */
exports.post_index = function(req, res) {

  var email, url, access_level;

  url = req.param("url");
  email = req.param("email");
  access_level = req.param("access_level") || 0;

  function error(err_msg) {
    console.error("collaborators.post_index() - %s", err_msg);
    var r = {
      errors: [err_msg],
      status: "error"
    };
    res.statusCode = 400;
    return res.end(JSON.stringify(r, null, '\t'));
  };

  function ok(message, created) {
    var r = {
      errors: [],
      status: "ok",
      message: message,
      created: created
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
        console.debug(
          "User %s tried to make a collaborator but doesn't have admin privileges on %s (access level: %s)",
          req.user.email, url, my_access_level);
        return error("You must have access level greater than 0 in order to be able to add collaborators.");
      }

      // can't add owner as a collaborator
      if (email === repo_owner.email) {
        console.debug(
          "Can't add owner as collaborator on project %s", url);
        return error("Can't add owner as collaborator");
      }
      models.User.findOne({email:email}, this);
    },
    function getRepoConfigAndUser(err, user_obj) {
      if (err) {
        var err_msg = "Error fetching user object for email " + email + ": " + err;
        return error(err_msg);
      }
      if (!user_obj) {
        // User does not exist in system, we must create a new invite or add collaboration to existing one.
        console.info(
          "collaborators.post_index() - Email %s does not have Strider account, inviting to collaborate on project %s requested by user %s",
          email, this.repo_config.display_url, req.user.email);
        // Look for an existing, unconsumed invite to this email address.
        models.InviteCode.findOne({emailed_to: email, consumed_timestamp: null}, function(err, existing_invite) {
          if (err) {
            var err_msg = "collaborators.post_index() - Error looking up existing invite for email " + email + ": " + err;
            return error(err_msg);
          }
          var new_collaboration = {
            repo_url: url,
            access_level: access_level,
            invited_by: req.user._id
          };
          if (existing_invite) {
            // Check if they have already been pushed onto the collaborations list
            // of the existing invite. This prevents them being added multiple times
            // when they do ultimately consume the invite.
            var found = _.find(existing_invite.collaborations, function(c) {
              return c.repo_url === url;
            });
            // There is already an outstanding invite to this user, just push these additional perms onto the collaborations
            // list and send another email. We only push if they have not already been added to the invite.
            if (!found) {
              models.InviteCode.update({_id:existing_invite._id}, {$push:{collaborations:new_collaboration}}, function(err) {
                if (err) {
                  var err_msg = "collaborators.post_index() - Error updating existing invite for email " + email + ": " + err;
                  return error(err_msg);
                }
                // Invite updated, should probably send another email to recipient.
                return ok(email + " does not yet have a Strider account. We have already emailed them an invite to collaborate.");
              });
            } else {
                return ok(email + " does not yet have a Strider account. We have already emailed them an invite to collaborate.");
            }
          } else {
            // No existing invite, create new and notify
            var random = crypto.randomBytes(5).toString('hex');
            var invite_code = nibbler.b32encode(random);
            var invite = new models.InviteCode();

            invite.code = invite_code;
            invite.created_timestamp = new Date();
            invite.emailed_to = email;
            invite.collaborations = [new_collaboration];

            invite.save(function(err, invite) {
              if (err) {
                var err_msg = "collaborators.post_index() - Error creating new invite for email " + email + ": " + err;
                return error(err_msg);
              }
              // Invite created, send email to recipient.
              mail.send_invite_collaborator_new_user(req, email, invite_code, url);
              return ok(email + " does not yet have a Strider account. We have emailed them an invite to collaborate.");
            });
          }
        });
        // TODO
      } else {
        // User already exists in system. Add them as a new collaborator or change their access_level.
        console.info(
          "collaborators.post_index() - Email %s has Strider account, inviting to collaborate on project %s requested by user %s",
          email, this.repo_config.display_url, req.user.email);
        var found = _.find(this.repo_config.collaborators, function(c) {
          return c.user_id.toString() == user_obj._id.toString();
        });
        if (found) {
          // Already a collaborator of this project, change the access_level
          console.info(
            "collaborators.post_index() - %s in collaborators list with access level %s",
            email, found.access_level);
          if (found.access_level != access_level) {
            console.info(
              "collaborators.post_index() - %s has access level %s but changing to %s",
              email, found.access_level, access_level);
            found.access_level = access_level;
            this.repo_owner.save(function(err) {
              if (err) {
                var errmsg = "Error changing access level for collaborator " + email + ": " + err;
                return error(err)
              }
              return ok(email + " has been switched to access level " + access_level);
            });

          } else {
            return error(email + " is already a collaborator on this project.");
          }
        } else {
          // Add a new, already-registered collaborator.
          console.info("collaborators.post_index() - %s not on collaborators list, adding",
            email);
          // Note the use of $push and the positional operator. This is much more efficient than
          // doing a full save() on a user obj.
          models.User.update({"github_config.url":this.repo_config.url},
            {
              $push:{"github_config.$.collaborators":
                {
                  type: "user",
                  user_id: user_obj._id,
                  access_level: access_level
                }
              }
            }, function(err) {
            if (err) {
              var errmsg = "Error adding collaborator " + email + ": " + err;
              return error(errmsg)
            }
            console.debug("collaborators.post_index() - saved collaborators list");
            // Send notification email here
            mail.send_invite_collaborator_existing_user(req, email, url);
            return ok(email + " is now a collaborator.", true);
          });
        }
      }
    }
  );

};

/*
 * DELETE /api/collaborators/
 *
 * Delete the specified user from the list of collaborators for the Github repository.
 *
 * @param url Github html_url of the project.
 * @param email Email of the user.
 */
exports.delete_index = function(req, res) {
  var url = req.param("url");
  var email = req.param("email");

  function error(err_msg) {
    console.error("collaborators.delete_index() - %s", err_msg);
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
        console.debug("User %s tried to delete a collaborator but doesn't have admin privileges on %s (access level: %s)",
          req.user.email, url, my_access_level);
        return error("You must have access level greater than 0 in order to be able to delete collaborators.");
      }
      models.User.findOne({"email":email}, this);
    },
    function deleteCollaborator(err, user_obj) {
      if (err) {
        var err_msg = "Error fetching user for email " + email + ": " + err;
        return error(err_msg);
      }
      if (!user_obj) {
        var err_msg = "Error looking up user for email: No such user found" + email;
        return error(err_msg);
      }
      // owner of repo cannot be deleted as collaborator
      if (this.repo_owner._id.toString() === user_obj._id.toString()) {
        console.debug("User %s tried to delete a owner %s from collaborators list for %s",
          user_obj.email, url);
        return error("Cannot remove owner from collaborators list");

      }

      models.User.update({"github_config.url":url},
        {$pull:{"github_config.$.collaborators":{"user_id":user_obj._id}}}, this);
    },
    function (err, affected) {
      if (err) {
        var err_msg = "Error removing collaborator from project " + url + " with email " + email + ": " + err;
        return error(err_msg);
      }
      return ok();
    }
  );

};
