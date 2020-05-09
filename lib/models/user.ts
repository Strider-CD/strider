import bcrypt from 'bcryptjs';
import Activedirectory from 'activedirectory';
import { Schema, model, Document } from 'mongoose';
import config from '../config';
import InviteCode from './invite';

export interface User extends Document {
  name: string;
  email: string;
  salt: string;
  hash: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  isAdUser: boolean;
  account_level: number;
  accounts: Account[];
  jobplugins: any;
  projects: Project[];
  jobs: any[];
  jobsQuantityOnPage: number;
  created: Date;

  projectAccessLevel: (project: any) => number;
  verifyPassword: (password: string, callback: Function) => void;
}

export interface Project {
  name: string;
  display_name: string;
  access_level: number;
}

export interface Account {
  id: string;
  provider: string;
  title: string;
  display_url: string;
  cache: {
    id: string;
    name: string;
    group: string;
    display_name: string;
    display_url: string;
    config: any;
  }[];
  config: any;
  last_updated: Date;
}

// active directory schema
const AdSchema = config.ldap ? new Activedirectory(config.ldap) : null;

const UserSchema = new Schema({
  name: { type: String, required: true, default: 'Unknown Name' },
  email: { type: String, required: true, index: true, unique: true },
  salt: { type: String, required: true },
  hash: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  // Is login by active directory, default false
  isAdUser: { type: Boolean, default: false },
  // 0 = normal user, 1 = strider admin
  account_level: Number,
  // defined by provider plugins
  accounts: [
    {
      provider: String, // name of the provider plugin
      id: String, // account id, defined by the provider
      title: String, // human readable account name
      display_url: String, // url to view your account on the hosted site
      // cache for provided repos
      cache: [
        {
          id: String, // unique ID, saved as "repo_id" in the provider section of the created project
          name: String, // human readable, displayed to the user
          display_name: String,
          config: {},
          display_url: String, // a url where the user can view the repo in a browser
          group: String, // a string for grouping the repos. In github, this would be the "organization"
        },
      ],
      last_updated: Date,
      config: {},
    },
  ],
  // user-level config
  jobplugins: {},
  // array of objects {name: "projectname", access_level: (int), display_name: (string)}
  projects: [
    {
      name: { type: String, index: true }, // lower-case canonical name
      display_name: String, // could be mixed case
      access_level: Number, // 0 - view jobs, 1 - start jobs, 2 - configure/admin
    },
  ],
  jobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
  jobsQuantityOnPage: {
    type: Number,
    default: 20,
  },
  created: Date,
});

const UserModel = model<User>('user', UserSchema);

UserSchema.virtual('password')
  .get(function () {
    return this._password;
  })
  .set(function (password: string) {
    this._password = password;
    const salt = (this.salt = bcrypt.genSaltSync(10));
    this.hash = bcrypt.hashSync(password, salt);
  });

// User.collaborators(project, [accessLevel,] done(err, [user, ...]))
//
// project: String name of the project
// accessLevel: int minimum access level. Defaults to 1
UserSchema.static('collaborators', function (
  project: string,
  accessLevel: number | Function,
  done: Function | undefined
) {
  if (arguments.length === 2) {
    done = accessLevel as Function;
    accessLevel = 1;
  }

  const query = {
    projects: {
      $elemMatch: {
        name: project.toLowerCase(),
        access_level: { $gte: accessLevel },
      },
    },
  };

  this.find(query, done);
});

// User.admins(done(err, [user, ...]))
UserSchema.static('admins', function (done: Function) {
  const query = { account_level: 1 };

  this.find(query, done);
});

// User.account(providerconfig)
// User.account(providerid, accountid)
// --> the account config that matches
// Throws an error if the account cannot be found.
UserSchema.method('account', function (provider: any, account?: any) {
  if (arguments.length === 1) {
    account = provider.account;
    provider = provider.id;
  }

  for (let i = 0; i < this.accounts.length; i++) {
    if (
      this.accounts[i].provider == provider &&
      this.accounts[i].id == account
    ) {
      return this.accounts[i];
    }
  }

  return false;
});

UserSchema.method('verifyPassword', function (
  password: string,
  callback: (err: Error, success: boolean) => void
) {
  bcrypt.compare(password, this.get('hash'), callback);
});

UserSchema.method('jobPluginData', function (
  name: string,
  config: any,
  done: Function
) {
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

UserSchema.static('getUserInfoFromActiveDirectory', function (
  email: string,
  callback: Function
) {
  AdSchema.findUser(email, function (err: Error, user?: any) {
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
UserSchema.static('loginByActiveDirectory', function (
  email: string,
  password: string,
  callback: Function
) {
  AdSchema.authenticate(email, password, (err: Error, auth?: any) => {
    if (err) {
      return callback(err, true);
    }

    if (!auth) {
      return callback('No User', false);
    }

    return this.getUserInfoFromActiveDirectory(email, callback);
  });
});

UserSchema.static('authenticate', function (
  email: string,
  password: string,
  callback: Function
) {
  // Has ad config
  if (config.ldap) {
    this.loginByActiveDirectory(email, password, (err: Error, adUser?: any) => {
      console.log(`Active directory login msg: ${err},  User info`, adUser);
      if (err && !adUser) {
        this.findOne(
          { email: email, isAdUser: false },
          (err: Error, user?: User) => {
            if (err) {
              return callback(err);
            }

            if (!user) {
              return callback('No User', false);
            }

            user.verifyPassword(
              password,
              (err: Error, passwordCorrect: boolean) => {
                if (err) {
                  return callback(err);
                }

                if (!passwordCorrect) {
                  return callback('Incorrect Password', false);
                }

                return callback(null, user);
              }
            );
          }
        );
      } else if (err) {
        return callback(err);
      }

      this.findOne(
        { email: email, isAdUser: true },
        (err: Error, user?: User) => {
          if (err) {
            return callback(err);
          }

          if (!user) {
            let isAdmin = false;
            if (
              config.ldap.adminDN &&
              adUser.dn.indexOf(config.ldap.adminDN) !== -1
            ) {
              isAdmin = true;
            }
            // register and return new user
            return this.register(
              {
                isAdUser: true,
                isAdmin: isAdmin,
                email: adUser.mail,
              },
              callback
            );
          }

          return callback(null, user);
        }
      );
    });
  } else {
    // Normal login
    this.findOne({ email: email }, (err: Error, user?: User) => {
      if (err) {
        return callback(err);
      }

      if (!user) {
        return callback('No User', false);
      }

      user.verifyPassword(password, (err: Error, passwordCorrect: boolean) => {
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

UserSchema.static('findByEmail', function (email: string, cb: Function) {
  this.find({ email: { $regex: new RegExp(email, 'i') } }, cb);
});

UserSchema.static('register', function (u: any, callback: Function) {
  // Create User
  const user = new UserModel();
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

UserSchema.static('registerWithInvite', function (
  inviteCode: string,
  email: string,
  password: string,
  cb: Function
) {
  // Check Invite Code
  InviteCode.findOne(
    {
      code: inviteCode,
      emailed_to: email,
      consumed_timestamp: null,
    },
    function (err: Error, invite?: any) {
      if (err || !invite) {
        return cb('Invalid Invite');
      }

      const projects: Project[] = [];
      // For each collaboration in the invite, add permissions to the repo_config
      if (
        invite.collaborations !== undefined &&
        invite.collaborations.length > 0
      ) {
        invite.collaborations.forEach(function (item: any) {
          projects.push({
            name: item.project.toLowerCase(),
            access_level: item.access_level,
            display_name: item.project.toLowerCase(),
          });
        });
      }

      this.register(
        {
          isAdUser: false,
          email: email,
          password: password,
          projects: projects,
        },
        (err?: Error, user?: User) => {
          if (err) {
            return cb(err);
          }
          // Mark Invite Code as used.
          InviteCode.updateOne(
            {
              code: inviteCode,
            },
            {
              $set: {
                consumed_timestamp: new Date(),
                consumed_by_user: user._id,
              },
            },
            {},
            (err?: Error) => {
              if (err) {
                return cb(
                  `Error updating invite code, user was created: ${err}`
                );
              } else {
                return cb(null, user);
              }
            }
          );
        }
      );
    }
  );
});

UserSchema.method('projectAccessLevel', function (this: User, project: any) {
  if (this.account_level > 0) {
    return 2;
  }

  if (this.projects) {
    for (let i = 0; i < this.projects.length; i++) {
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

UserSchema.static('projectAccessLevel', function (user: User, project: any) {
  if (user) {
    return user.projectAccessLevel(project);
  }

  if (project.public) {
    return 0;
  }

  return -1;
});

UserSchema.path('jobsQuantityOnPage').get(function (quantity: number) {
  return config.jobsQuantityOnPage.enabled
    ? quantity
    : config.jobsQuantityOnPage.default;
});

export default UserModel;
