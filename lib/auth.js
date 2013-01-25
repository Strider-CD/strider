// Everyauth config for the app
var _ = require('underscore')
  , emitter = require('./common').emitter
  , config = require('../config')
  , logging = require('./logging')
  , url = require('url')
  ;

// Slightly odd signature because of modules/mongoose and pass by reference
// not working all that well. So userf is a closure.
function init(schema, userf, InviteCode, mongoose_auth) {
  schema.plugin(mongoose_auth, {
    everymodule: {
      everyauth: {
          User: userf
      }
    }
    , password: {
        loginWith: 'email'
      , everyauth: {
            getLoginPath: '/login'
          , postLoginPath: '/login'
          , loginView: 'index.jade'
          , getRegisterPath: '/index'
          , postRegisterPath: '/register'
          , registerView: 'index.jade'
          , loginSuccessRedirect: '/'
          , registerSuccessRedirect: '/'
          , loginLocals: {product:'Strider', page:'Brilliant Continuous Deployment'}
          , registerLocals: {product:'Strider', page:'Brilliant Continuous Deployment', code:''}
          // We also care about invite code during beta period
          , extractExtraRegistrationParams: function (req) {
            return {
              invite_code: req.body.invite_code
            }
          }
          // Custom validator to power invite code system
        , validateRegistration: function (newUserAttributes, baseErrors) {
            var invite_code = newUserAttributes.invite_code;
            if (!invite_code || invite_code === undefined) {
              baseErrors.push("No invite code specified");
            }
            if (baseErrors.length > 0) {
              return baseErrors;
            }
            var promise = this.Promise();

            InviteCode.findOne({code:invite_code, consumed_timestamp:null},
              function(err, inviteCode) {
              if (err || !inviteCode) {
                return promise.fulfill(["Could not locate invite code"]);
              }
              return promise.fulfill([]);
            });
            return promise;
          }
        , registerUser: function (newUserAttributes) {
          var promise = this.Promise();
          var self = this;
          this.User()().create(newUserAttributes, function (err, createdUser) {
            if (err) {
              console.log(err);
              if (/duplicate key/.test(err)) {
                return promise.fulfill(['Someone has already claimed that login']);
              }
              return promise.fail(err);
            }
            var invite_code = newUserAttributes.invite_code;
            InviteCode.findOne({code:invite_code, consumed_timestamp:null}, function(err, i) {
              if (i != null && i.collaborations !== undefined && i.collaborations.length > 0) {
                // For each collaboration in the invite, add permissions to the repo_config
                _.each(i.collaborations, function(c) {
                  console.debug("pushing: %j", c);
                  self.User()().update({"github_config.url":c.repo_url},
                    {
                      $push:{"github_config.$.collaborators":
                        {
                          type: c.type,
                          user_id: createdUser._id,
                          access_level: c.access_level
                        }
                      }
                    }, function(err) {
                      if (err) {
                        console.debug("User regstration - failure applying collaborators from invite: %s", err);
                      }
                    }
                  );
               });


              }


              InviteCode.update({code:invite_code},
              {"$set": {consumed_timestamp:new Date(), consumed_by_user:createdUser._id}}, {}, function(err, num) {
                if (err)
                  console.log(err);
              });
              promise.fulfill(createdUser);
            });
          });
          return promise;
        }
       }
   }
   , github : {
     everyauth: {
          // App ID and Secret from Github
          // Create at http://github.com/account/applications/new
            appId: config.github.appId
          , appSecret: config.github.appSecret
          , redirectPath: '/add_repo'
          , scope: "user,repo"
          , myHostname: config.github.myHostname.replace(/\/+$/,"")
          // Start crazy everyauth oauth2 module security overrides
          , handleAuthCallbackError: function(req, res) {
              // XXX Pretty
              res.writeHead(401);
              res.end("you must be logged in to link your account");
          }
          // Use oauth2 module's getCode as an insertion point for our logic
          // to allow only logged-in users to link accounts.
          , getCode: function (req, res) {
              var parsedUrl = url.parse(req.url, true);
              if (!req.user || this._authCallbackDidErr(req)) {
                return this.breakTo('authCallbackErrorSteps', req, res);
              }
              return parsedUrl.query && parsedUrl.query.code;
          }
          , findOrCreateUser: function (session, accessTok, accessTokExtra, ghUser) {
              var promise = this.Promise();
              // We are already logged into Strider, and we have successfully
              // retrieved the Github data, so we can safely link to current user.
               this.User()().findOne({'_id': session.auth.userId}, function (err, foundUser) {
                  ghUserLink(ghUser, accessTok, foundUser);
                  foundUser.save(function(err, user) {
                      if (err) return promise.fail(err);
                      return promise.fulfill(user);
                  });
               });
               return promise;
            }
       }
    }
  });
}

/* Assign all the various properties coming from github to the user document */
function ghUserLink(ghUser, ghAccessToken, user) {

  var github = {
            id: ghUser.id
          , type: ghUser.type
          , login: ghUser.login
          , accessToken: ghAccessToken
          , gravatarId: ghUser.gravatar_id
          , name: ghUser.name
          , email: ghUser.email
          , publicRepoCount: ghUser.public_repo_count
          , publicGistCount: ghUser.public_gist_count
          , followingCount: ghUser.following_count
          , followersCount: ghUser.followers_count
          , company: ghUser.company
          , blog: ghUser.blog
          , location: ghUser.location
          , permission: ghUser.permission
          , createdAt: ghUser.created_at
          // Private data
          , totalPrivateRepoCount: ghUser.total_private_repo_count
          , collaborators: ghUser.collaborators
          , diskUsage: ghUser.disk_usage
          , ownedPrivateRepoCount: ghUser.owned_private_repo_count
          , privateGistCount: ghUser.private_gist_count
          , plan: {
                name: ghUser.plan.name
              , collaborators: ghUser.plan.collaborators
              , space: ghUser.plan.space
              , privateRepos: ghUser.plan.private_repos
          }
    };
    user.github = github;
}


module.exports = {
  init: init
};
