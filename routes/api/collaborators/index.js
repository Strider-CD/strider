var BASE_PATH = "../../../lib/";
var _ = require('underscore')
  , models = require(BASE_PATH + 'models')
  , User = models.User
  , crypto = require('crypto')
  , logging = require(BASE_PATH + 'logging')
  , nibbler = require(BASE_PATH + 'nibbler')
  , Step = require('step')
  , mail = require(BASE_PATH + 'email')

  , api = require('./api')

function email_to_gravatar(email) {
  var gravatar = 'https://secure.gravatar.com/avatar/' +
    crypto.createHash('md5').update(email).digest("hex") +
    'd=identicon';

  return gravatar;
}

module.exports = {
  get: get,
  post: post,
  del: del
}


/*
 * GET /:org/:repo/collaborators
 *
 * Get the current list of collaborators for the Github repository.
 *
 * @param url Github html_url of the project.
 */
function get(req, res) {
  var project = req.params.org + '/' + req.params.repo
  User.collaborators(project, 0, function (err, users) {
    if (err) return res.send(500, 'Failed to get users: ' + err.message)
    var results = []
    for (var i=0; i<users.length; i++) {
      var p = _.find(users[i].projects, function(p) {
        return p.name === project.toLowerCase()
      })
      results.push({
        type: "user",
        id: users[i]._id,
        email: users[i].email,
        access_level: p.access_level,
        gravatar: email_to_gravatar(users[i].email)
      })
    }
    res.send(results)
  })
}

/*
 * POST /:org/:repo/collaborators/
 *
 * Add a new collaborator for a Github repository. You must have admin privileges on the corresponding RepoConfig
 * to be able to use this endpoint.
 *
 * @param email Email address to add. If the user is not registered with Strider, we will send them an invite. If
 * they are already registered, they will receive a notification of access.
 * @param access_level Access level to grant. 0 = read-only, 1 = admin (default: 0)
 */
function post(req, res) {
  var project = req.params.org + '/' + req.params.repo
    , accessLevel = req.param('access_level') || 1
    , email = req.param('email')
  api.add(project, email, accessLevel, req.user, function (err, existed, already_invited) {
    if (err) return res.send(500, 'Failed to add collaborator: ' + err.message)
    if (existed) return res.send({status: 'success'})
    if (!already_invited) return res.send({status: 'sent_invite'})
    res.send({status: 'already_invited'})
  })
}

/*
 * DELETE /:org/:repo/collaborators/
 *
 * Delete the specified user from the list of collaborators for the Github repository.
 *
 * @param email Email of the user.
 */
function del(req, res) {
  var project = req.params.org + '/' + req.params.repo
    , email = req.param("email")
  api.del(project, email, function (err) {
    if (err) return res.send(500, err.message)
    res.send({status: 'removed'})
  })
}
