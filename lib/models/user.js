
var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , _ = require('underscore')
  , bcrypt = require('bcrypt')

  , utils = require('../utils')
  , InviteCode = require('./invite')

var UserSchema = new Schema({
    email: { type: String, required: true, index: true }
  , salt: { type: String, required: true }
  , hash: { type: String, required: true }
  , account_level: Number
  // cache for provided repos
  // looks like: {provider_id: cache, ...}, where cahce is
  // [{
  //   id: string <-- required this will be stored in the final
  //       project schema to identify repos that have already been
  //       configured.
  //   url: string,
  //   display_url: string,
  //   name: string,
  //   group: string <-- for display, repos will be grouped by this key
  // }, ...]
  , repo_cache: {}
  // defined by provider plugins
  , providers: {}
  // user-level config
  , jobplugins: {}
  // map of "projectname": access_level (int)
  , projects: {}
  , jobs: [{type: Schema.ObjectId, ref: 'Job'}]
});

// removed:
// findCollaborators
// get_repo_config

UserSchema.virtual('password')
.get(function () {
  return this._password;
})
.set(function (password) {
  this._password = password;
  var salt = this.salt = bcrypt.genSaltSync(10);
  this.hash = bcrypt.hashSync(password, salt);
});

// User.collaborators(project, [accessLevel,] done(err, [user, ...]))
//
// project: String name of the project
// accessLevel: int minimum access level. Defaults to 1
UserSchema.static('collaborators', function (project, accessLevel, done) {
  if (arguments.length === 2) {
    done = accessLevel
    accessLevel = 1
  }
  var query = {}
  query[project] = {$gte: accessLevel}
  this.find({projects: query}, done)
})

UserSchema.method('verifyPassword', function(password, callback) {
  bcrypt.compare(password, this.get('hash'), callback);
});

UserSchema.static('authenticate', function(email, password, callback) {
  this.findOne({ email: email }, function(err, user) {
    if (err) { return callback(err); }
    if (!user) { return callback("No User", false); }

    user.verifyPassword(password, function(err, passwordCorrect) {
      if (err) { return callback(err); }
      if (!passwordCorrect) { return callback("Incorrect PWD", false); }
      return callback(null, user);
    });
  });
})

UserSchema.static('registerWithInvite', function(inviteCode, email, password, cb){
  // Check Invite Code
  InviteCode.findOne({code:inviteCode, consumed_timestamp:null}, function(err, invite){

    if (err || !invite ){
      return cb("Invalid Invite")
    }

    // Create User
    var user = new User()
    user.email = email
    user.set('password', password)
    // For each collaboration in the invite, add permissions to the repo_config
    if (invite.collaborations !== undefined && invite.collaborations.length > 0) {
      _.each(invite.collaborations, function(item) {
        user.projects[item.project] = item.access_level
      })
    }
    user.save(function (e, user) {
      if (e) return cb("Error Creating User:" + e)

      // Mark Invite Code as used.
      InviteCode.update(
          {code:inviteCode}
        , {"$set": {consumed_timestamp:new Date(), consumed_by_user:user._id}}
        , {}
        , function(err, num) {
          if (err)
            return cb("Error updating invite code, user was created: " + err)
          else 
            return cb(null, user)
        }
      ) 
    })
  })
})

var User = module.exports = mongoose.model('user', UserSchema)
