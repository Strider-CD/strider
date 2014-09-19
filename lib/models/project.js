'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findBranch = require('../utils').findBranch;

var PluginConfig = new Schema({
  id: String,
  config: {},
  showStatus: {
    type: Boolean,
    default: true
  },
  enabled: Boolean
});

var BranchConfig = new Schema({
  active: {
    type: Boolean,
    default: true
  },
  name: { type: String },
  mirror_master: {
    type: Boolean,
    default: true
  },
  deploy_on_green: {
    type: Boolean,
    default: true
  },
  // ssh keypair
  pubkey: String,
  privkey: String,
  // add the ssh keys to the ENV
  envKeys: Boolean,
  // job & runner plugins
  plugins: [PluginConfig],
  runner: {
    id: String,
    config: {}
  },
  // for persistance, not configuration
  plugin_data: {}
});

var ProjectSchema = new Schema({
  // name is always lower case!
  name: {
    type: String,
    unique: true,
    index: true
  },
  display_name: { type: String }, // display name can be mixed case, for display
  public: {
    type: Boolean,
    default: false,
    index: true
  },
  display_url: String,
  // grab the `.strider.json` in advance - could be expensive for some
  // providers (like raw git). This allows runner configuration in the
  // .strider.json file.
  prefetch_config: {
    type: Boolean,
    default: true
  },
  // used for user-level provider & plugin config.
  creator: {
    type: Schema.ObjectId,
    ref: 'user',
    index: true
  },
  // looks like:
  // { master: BranchConfig, otherbranch: 'master' || BranchConfig, ... }
  // if a branch maps to 'master', it has all of the same configuration, but 'deploy_on_green' is false
  branches: [BranchConfig],
  provider: {
    id: String,      // plugin id of the provider
    account: String, // account id
    repo_id: String, // id of the repository
    config: {        // decided by the provider
      // url: String
    }
  }
});

// name: the name of the new branch
// done(err)
ProjectSchema.method('addBranch', function (name, done) {
  var branch = {
    name: name,
    mirror_master: true
  };

  this.branches.push(branch);
  this.collection.update({ _id: this._id }, {
    $push: { branches: branch }
  }, function (err, changed) {
    if (err) {
      return done(err);
    }

    if (!changed) {
      return done(new Error('no projects effected by adding branch'));
    }

    done(null, branch);
  });
});

ProjectSchema.method('branch', function (name) {
  return findBranch(this.branches, name);
});

ProjectSchema.static('forUser', function (user, done) {
  // Default to all projects
  var query = {};

  // If we are not an admin i.e account level is not set or < 1, show only user projects
  if (!user.account_level || user.account_level < 1) {
    if (!user.projects) {
      return done(null, []);
    }

    var names = user.projects.map(function (p) {
      return p.name.toLowerCase();
    });

    if (!names.length) {
      return done(null, []);
    }

    query = {
      name: { $in: names }
    };
  }

  this.find(query, done);
});

module.exports = mongoose.model('Project', ProjectSchema);
