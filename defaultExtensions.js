var utils = require('./lib/utils')
  , path = require('path')


// TODO - most of this is cruft that should be moved
module.exports = function(ext){

  ext['collaborators'] = {

    panel : {
      id: 'collaborators',
      title: 'Collaborators',
      controller: 'CollaboratorsCtrl',
      script_path: '/javascripts/config/collaborators.js',
      src  : path.join(__dirname, './views/config/collaborators.html'),
      data: function (user, repo, models, next) {
        if (!repo.collaborators) return []
        models.User.findCollaborators(repo.collaborators, function (err, whitelist) {
          whitelist.push({
            type: "user",
            email: user.email,
            access_level: 1,
            owner: true,
            gravatar: utils.gravatar(user.email)
          })
          next(null, whitelist)
        })
      }
    }
  }

  ext['github'] = {
    panel: {
      id: 'github',
      title: 'Github Config',
      data: false,
      script_path: '/javascripts/config/github.js',
      src  : path.join(__dirname, './views/config/github.html'),
      /*
      data: function () {
        // we don't currently check to see that the webhook is still there. Should we?
        // maybe we check every once in a while. No more than once an hour?
      }
      */
    }
  }
  
  ext['heroku'] = {
    panel : {
      id: 'heroku',
      title: 'Heroku Config',
      script_path: '/javascripts/config/heroku.js',
      src  : path.join(__dirname, './views/config/heroku.html'),
      data: function (user, repo, models, next) {
        try {
          user.get_prod_deploy_target(repo.url, function (err, target) {
            if (err === 'No deploy target found') return next(null, false)
            next(err, target);
          });
        } catch (e) {
          console.log(e, e.stack);
          next(e);
        }
      }
    }
  }
 
  ext.webhooks = {}
  ext['webhooks'].panel = {
    id: 'webhooks',
    title: 'Webhooks',
    data: 'webhooks',
    src  : path.join(__dirname, './views/config/webhooks.html'),
  }
  
  ext.deactivate = {}
  ext['deactivate'].panel = {
    id: 'deactivate',
    title: 'Deactivate',
    data: 'active',
    src  : path.join(__dirname, './views/config/deactivate.html'),
  }
}
