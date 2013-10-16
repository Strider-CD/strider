
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
  // 0 = normal user, 1 = strider admin
  , account_level: Number
  // defined by provider plugins
  , accounts: [{
      provider: String, // name of the provider plugin
      id: String,       // account id, defined by the provider
      title: String,    // human readable account name
      display_url: String, // url to view your account on the hosted site
      // cache for provided repos
      cache: [{
        id: String,          // unique ID, saved as "repo_id" in the provider section of the created project
        name: String,        // human readable, displayed to the user
        display_name: String,
        config: {},
        display_url: String, // a url where the user can view the repo in a browser
        group: String        // a string for grouping the repos. In github, this would be the "organization"
      }],
      last_updated: Date,
      config: {},
    }]
  // user-level config
  , jobplugins: {}
  // array of objects {name: "projectname", access_level: (int), display_name: (string)}
  , projects: [
        { 
          name: {type: String, index: true}, // lower-case canonical name
          display_name: String, // could be mixed case
          access_level: Number  // 0 - view jobs, 1 - start jobs, 2 - configure/admin
        }
    ]
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
  var query = {
    'projects': {
      '$elemMatch': {
        'name': project.toLowerCase(),
        'access_level': {$gte: accessLevel}
      }
    },
  }
  this.find(query, done)
})

// User.account(providerconfig)
// User.account(providerid, accountid)
// --> the account config that matches
// Throws an error if the account cannot be found.
UserSchema.method('account', function (provider, account) {
  if (arguments.length === 1) {
    account = provider.account
    provider = provider.id
  }
  for (var i=0; i<this.accounts.length; i++) {
    if (this.accounts[i].provider === provider &&
        this.accounts[i].id === account) {
      return this.accounts[i]
    }
  }
  return false
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

UserSchema.static('findByEmail', function(email, cb){
  this.find({ email : email }, cb)
})


UserSchema.static('registerWithInvite', function(inviteCode, email, password, cb) {
  // Check Invite Code
  InviteCode.findOne({code:inviteCode, consumed_timestamp:null}, function(err, invite){

    if (err || !invite ){
      return cb("Invalid Invite")
    }

    // Create User
    var user = new User()
    user.email = email
    user.set('password', password)
    user.projects = []
    // For each collaboration in the invite, add permissions to the repo_config
    if (invite.collaborations !== undefined && invite.collaborations.length > 0) {
      _.each(invite.collaborations, function(item) {
        user.projects.push({name: item.project.toLowerCase(), access_level:item.access_level, display_name: item.project.toLowerCase()})
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
