
var BASE_PATH = "../../../lib/";
var models = require(BASE_PATH + 'models')
  , User = models.User
  , InviteCode = models.InviteCode

  , _ = require('underscore')
  , crypto = require('crypto')

  , nibbler = require(BASE_PATH + 'nibbler')
  , mail = require(BASE_PATH + 'email')

module.exports = {
  add: add,
  del: del
}

function updateInvite(invite, collaboration, done) {
  var found = _.find(invite.collaborations, function(c) {
    return c.project === collaboration.project
  })
  // There is already an outstanding invite to this user, just push these additional perms onto the collaborations
  // list and send another email. We only push if they have not already been added to the invite.
  if (!found) {
    invite.update({$push:{collaborations: collaboration}}, function(err) {
      if (err) return done(err)
      // Invite updated, should probably send another email to recipient.
      return done(null, false, false)
    });
  } else {
    return done(null, false, true)
  }
}

function sendInvite(inviter, email, collaboration, done) {
  var random = crypto.randomBytes(5).toString('hex')
    , invite_code = nibbler.b32encode(random)
    , invite = new InviteCode({
        code: invite_code,
        emailed_to: email,
        created_timestamp: new Date(),
        collaborations: [collaboration]
      });

  invite.save(function(err, invite) {
    if (err) return done(err)
    // Invite created, send email to recipient.
    mail.send_invite_collaborator_new_user(inviter, email, invite_code, collaboration.project);
    return done(null, false, false)
  });

}

// done(err, userExisted, inviteExisted)
function add(project, email, accessLevel, inviter, done) {
  User.findOne({email: email}, function (err, user) {
    if (err) return done(err)
    if (user) {
      user.projects[project] = accessLevel
      return user.save(function (err) {
        if (err) return done(err)
        done(null, true)
      })
    }
    var collaboration = {
      project: project,
      invited_by: inviter._id,
      access_level: accessLevel
    }
    InviteCode.findOne({emailed_to: email, consumed_timestamp: null}, function(err, invite) {
      if (err) return done(err)
      if (invite) {
        return updateInvite(invite, collaboration, done)
      }
      sendInvite(inviter, email, collaboration, done)
    })
  })
}

function del(project, email, done) {
  User.findOne({email: email}, function (err, user) {
    if (err) return done(err);
    delete user.projects[project]
    user.save(done)
  })
}
