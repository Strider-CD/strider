'use strict';

var bcrypt = require('bcryptjs');
var Activedirectory = require('activedirectory');
var config = require('../config');
var mongoose = require('../mongoose-shim');
var InviteCode = require('./invite');

var Schema = mongoose.Schema;
var User;

// active directory schema
var AdSchema = config.ldap ? new Activedirectory(config.ldap) : null;

var UserSchema = new Schema({
  email: {type: String, required: true, index: true, unique: true},
  salt: {type: String, required: true},
  hash: {type: String, required: true},
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  // Is login by active directory, default false
  isAdUser: { type: Boolean, default: false },
  // 0 = normal user, 1 = strider admin
  account_level: Number,
  // defined by provider plugins
  accounts: [{
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
    config: {}
  }],
  // user-level config
  jobplugins: {},
  // array of objects {name: "projectname", access_level: (int), display_name: (string)}
  projects: [
    {
      name: {type: String, index: true}, // lower-case canonical name
      display_name: String, // could be mixed case
      access_level: Number  // 0 - view jobs, 1 - start jobs, 2 - configure/admin
    }
  ],
  jobs: [{type: Schema.ObjectId, ref: 'Job'}],
  created: Date
});

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
    done = accessLevel;
    accessLevel = 1;
  }

  var query = {
    'projects': {
      '$elemMatch': {
        'name': project.toLowerCase(),
        'access_level': {$gte: accessLevel}
      }
    }
  };

  this.find(query, done);
});

// User.admins(done(err, [user, ...]))
UserSchema.static('admins', function (done) {
  var query = {'account_level': 1};

  this.find(query, done);
});

// User.account(providerconfig)
// User.account(providerid, accountid)
// --> the account config that matches
// Throws an error if the account cannot be found.
UserSchema.method('account', function (provider, account) {
  if (arguments.length === 1) {
    account = provider.account;
    provider = provider.id;
  }

  for (var i = 0; i < this.accounts.length; i++) {
    if (this.accounts[i].provider == provider &&
      this.accounts[i].id == account) {
      return this.accounts[i];
    }
  }

  return false;
});

UserSchema.method('verifyPassword', function (password, callback) {
  bcrypt.compare(password, this.get('hash'), callback);
});

UserSchema.method('jobPluginData', function (name, config, done) {
  if (!this.jobplugins) {
    this.jobplugins = {};
  }

  if (arguments.length === 1) {
    return this.jobplugins[name];
  }

  this.jobplugins[name] = config;
  this.markModified('jobplugins');
  this.save(done);
});

UserSchema.static('getUserInfoFromActiveDirectory', function (email, callback) {
  AdSchema.findUser(email, function (err, user) {
    if (err) {
      return callback(err, true);
    }

    if (!user) {
      return callback('No User', false);
    }

    return callback(null, user);
  });
});

// Login by active directory
UserSchema.static('loginByActiveDirectory', function (email, password, callback) {
  AdSchema.authenticate(email, password, function (err, auth) {
    if (err) {
      return callback(err, true);
    }

    if (!auth) {
      return callback('No User', false);
    }

    return this.getUserInfoFromActiveDirectory(email, callback);
  }.bind(this));
});

UserSchema.static('authenticate', function (email, password, callback) {
  // Has ad config
  if (config.ldap) {

    this.loginByActiveDirectory(email, password, function (err, adUser) {
      console.log(`Active directory login msg: ${err},  User info`, adUser);
      if (err && !adUser) {
        this.findOne({email: email, isAdUser: false}, function (err, user) {
          if (err) {
            return callback(err);
          }

          if (!user) {
            return callback('No User', false);
          }

          user.verifyPassword(password, function (err, passwordCorrect) {
            if (err) {
              return callback(err);
            }

            if (!passwordCorrect) {
              return callback('Incorrect Password', false);
            }

            return callback(null, user);
          });
        });
      } else if(err) {
        return callback(err);
      }

      this.findOne({email: email, isAdUser: true}, function (err, user) {
        if (err) {
          return callback(err);
        }

        if (!user) {
          var isAdmin = false;
          if (config.ldap.adminDN && adUser.dn.indexOf(config.ldap.adminDN) !== -1) {
            isAdmin = true;
          }
          // register and return new user
          return this.register({
            isAdUser: true,
            isAdmin: isAdmin,
            email: adUser.mail
          }, callback);
        }

        return callback(null, user);
      }.bind(this));
    }.bind(this));

  } else {
    // Normal login
    this.findOne({email: email}, function (err, user) {
      if (err) {
        return callback(err);
      }

      if (!user) {
        return callback('No User', false);
      }

      user.verifyPassword(password, function (err, passwordCorrect) {
        if (err) {
          return callback(err);
        }

        if (!passwordCorrect) {
          return callback('Incorrect Password', false);
        }

        return callback(null, user);
      });
    });
  }
});

UserSchema.static('findByEmail', function (email, cb) {
  this.find({email: {$regex: new RegExp(email, 'i')}}, cb);
});

UserSchema.static('register', function (u, callback) {
  // Create User
  var user = new User();
  user.isAdUser = !!u.isAdUser;
  user.account_level = u.isAdmin ? 1 : 0;
  user.email = u.email.toLowerCase();
  user.created = new Date();
  user.set('password', u.isAdUser ? '' : u.password);
  user.projects = u.projects || [];

  user.save(function (error, user) {
    if (error) {
      return callback(`Error Creating User:${error}`);
    }
    callback(null, user);
  });
});


UserSchema.static('registerWithInvite', function (inviteCode, email, password, cb) {
  // Check Invite Code
  InviteCode.findOne({
    code: inviteCode,
    emailed_to: email,
    consumed_timestamp: null
  }, function (err, invite) {
    if (err || !invite) {
      return cb('Invalid Invite');
    }

    var projects = [];
    // For each collaboration in the invite, add permissions to the repo_config
    if (invite.collaborations !== undefined && invite.collaborations.length > 0) {
      invite.collaborations.forEach(function (item) {
        projects.push({
          name: item.project.toLowerCase(),
          access_level: item.access_level,
          display_name: item.project.toLowerCase()
        });
      });
    }

    this.register({
      isAdUser: false,
      email: email,
      password: password,
      projects: projects
    }, function (err, user) {
      if (err) {
        return cb(err);
      }
      // Mark Invite Code as used.
      InviteCode.update({
        code: inviteCode
      }, {
        '$set': {
          consumed_timestamp: new Date(),
          consumed_by_user: user._id
        }
      }, {}, function (err) {
        if (err) {
          return cb(`Error updating invite code, user was created: ${err}`);
        } else {
          return cb(null, user);
        }
      });
    });

  }.bind(this));
});



UserSchema.method('projectAccessLevel', function (project) {
  if (this.account_level > 0) {
    return 2;
  }

  if (this.projects) {
    for (var i = 0; i < this.projects.length; i++) {
      if (this.projects[i].name === project.name) {
        return this.projects[i].access_level;
      }
    }
  }

  if (project.public) {
    return 0;
  }

  return -1;
});

UserSchema.static('projectAccessLevel', function (user, project) {
  if (user) {
    return user.projectAccessLevel(project);
  }

  if (project.public) {
    return 0;
  }

  return -1;
});

User = module.exports = mongoose.model('user', UserSchema);
