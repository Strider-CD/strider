"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const activedirectory_1 = __importDefault(require("activedirectory"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../config"));
const invite_1 = __importDefault(require("./invite"));
// eslint-disable-next-line prefer-const
let UserModel;
// active directory schema
const AdSchema = config_1.default.ldap ? new activedirectory_1.default(config_1.default.ldap) : null;
const UserSchema = new mongoose_1.Schema({
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
            provider: String,
            id: String,
            title: String,
            display_url: String,
            // cache for provided repos
            cache: [
                {
                    id: String,
                    name: String,
                    display_name: String,
                    config: {},
                    display_url: String,
                    group: String,
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
            name: { type: String, index: true },
            display_name: String,
            access_level: Number,
        },
    ],
    jobs: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Job' }],
    jobsQuantityOnPage: {
        type: Number,
        default: 20,
    },
    created: Date,
});
UserSchema.virtual('password')
    .get(function () {
    return this._password;
})
    .set(function (password) {
    this._password = password;
    const salt = (this.salt = bcryptjs_1.default.genSaltSync(10));
    this.hash = bcryptjs_1.default.hashSync(password, salt);
});
// User.collaborators(project, [accessLevel,] done(err, [user, ...]))
//
// project: String name of the project
// accessLevel: int minimum access level. Defaults to 1
UserSchema.statics.collaborators = function (project, accessLevel, done) {
    if (arguments.length === 2) {
        done = accessLevel;
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
};
// User.admins(done(err, [user, ...]))
UserSchema.statics.admins = function (done) {
    const query = { account_level: 1 };
    this.find(query, done);
};
// User.account(providerconfig)
// User.account(providerid, accountid)
// --> the account config that matches
// Throws an error if the account cannot be found.
UserSchema.methods.account = function (provider, account) {
    if (arguments.length === 1) {
        account = provider.account;
        provider = provider.id;
    }
    for (let i = 0; i < this.accounts.length; i++) {
        if (this.accounts[i].provider == provider &&
            this.accounts[i].id == account) {
            return this.accounts[i];
        }
    }
    return false;
};
UserSchema.methods.verifyPassword = function (password, callback) {
    bcryptjs_1.default.compare(password, this.get('hash'), callback);
};
UserSchema.methods.jobPluginData = function (name, config, done) {
    if (!this.jobplugins) {
        this.jobplugins = {};
    }
    if (arguments.length === 1) {
        return this.jobplugins[name];
    }
    this.jobplugins[name] = config;
    this.markModified('jobplugins');
    this.save(done);
};
UserSchema.statics.getUserInfoFromActiveDirectory = function (email, callback) {
    AdSchema.findUser(email, function (err, user) {
        if (err) {
            return callback(err, true);
        }
        if (!user) {
            return callback('No User', false);
        }
        return callback(null, user);
    });
};
// Login by active directory
UserSchema.statics.loginByActiveDirectory = function (email, password, callback) {
    AdSchema.authenticate(email, password, (err, auth) => {
        if (err) {
            return callback(err, true);
        }
        if (!auth) {
            return callback('No User', false);
        }
        return this.getUserInfoFromActiveDirectory(email, callback);
    });
};
UserSchema.statics.authenticate = function (email, password, callback) {
    // Has ad config
    if (config_1.default.ldap) {
        this.loginByActiveDirectory(email, password, (err, adUser) => {
            console.log(`Active directory login msg: ${err},  User info`, adUser);
            if (err && !adUser) {
                this.findOne({ email: email, isAdUser: false }, (err, user) => {
                    if (err) {
                        return callback(err);
                    }
                    if (!user) {
                        return callback('No User', false);
                    }
                    user.verifyPassword(password, (err, passwordCorrect) => {
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
            else if (err) {
                return callback(err);
            }
            this.findOne({ email: email, isAdUser: true }, (err, user) => {
                if (err) {
                    return callback(err);
                }
                if (!user) {
                    let isAdmin = false;
                    if (config_1.default.ldap.adminDN &&
                        adUser.dn.indexOf(config_1.default.ldap.adminDN) !== -1) {
                        isAdmin = true;
                    }
                    // register and return new user
                    return this.register({
                        isAdUser: true,
                        isAdmin: isAdmin,
                        email: adUser.mail,
                    }, callback);
                }
                return callback(null, user);
            });
        });
    }
    else {
        // Normal login
        this.findOne({ email: email }, (err, user) => {
            if (err) {
                return callback(err);
            }
            if (!user) {
                return callback('No User', false);
            }
            user.verifyPassword(password, (err, passwordCorrect) => {
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
};
UserSchema.statics.findByEmail = function (email, cb) {
    this.find({ email: { $regex: new RegExp(email, 'i') } }, cb);
};
UserSchema.statics.register = function (u, callback) {
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
};
UserSchema.statics.registerWithInvite = function (inviteCode, email, password, cb) {
    // Check Invite Code
    invite_1.default.findOne({
        code: inviteCode,
        emailed_to: email,
        consumed_timestamp: null,
    }, function (err, invite) {
        if (err || !invite) {
            return cb('Invalid Invite');
        }
        const projects = [];
        // For each collaboration in the invite, add permissions to the repo_config
        if (invite.collaborations !== undefined &&
            invite.collaborations.length > 0) {
            invite.collaborations.forEach(function (item) {
                projects.push({
                    name: item.project.toLowerCase(),
                    access_level: item.access_level,
                    display_name: item.project.toLowerCase(),
                });
            });
        }
        this.register({
            isAdUser: false,
            email: email,
            password: password,
            projects: projects,
        }, (err, user) => {
            if (err) {
                return cb(err);
            }
            // Mark Invite Code as used.
            invite_1.default.updateOne({
                code: inviteCode,
            }, {
                $set: {
                    consumed_timestamp: new Date(),
                    consumed_by_user: user._id,
                },
            }, {}, (err) => {
                if (err) {
                    return cb(`Error updating invite code, user was created: ${err}`);
                }
                else {
                    return cb(null, user);
                }
            });
        });
    });
};
UserSchema.methods.projectAccessLevel = function (project) {
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
};
UserSchema.statics.projectAccessLevel = function (user, project) {
    if (user) {
        return user.projectAccessLevel(project);
    }
    if (project.public) {
        return 0;
    }
    return -1;
};
UserSchema.path('jobsQuantityOnPage').get(function (quantity) {
    return config_1.default.jobsQuantityOnPage.enabled
        ? quantity
        : config_1.default.jobsQuantityOnPage.default;
});
UserModel = mongoose_1.model('user', UserSchema);
exports.default = UserModel;
//# sourceMappingURL=user.js.map