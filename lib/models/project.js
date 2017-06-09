'use strict';

var _ = require('lodash');
var mongoose = require('../mongoose-shim');
var findEnvironment = require('../utils').findEnvironment;
var Schema = mongoose.Schema;

var PluginConfig = new Schema({
  id: String,
  config: {},
  showStatus: {
    type: Boolean,
    default: true
  },
  enabled: Boolean
});

/**
 * Valid entries:
 *  { type: 'branch', name: 'master' }
 */
var SourceConfig = new Schema({
  type: String,
  name: String,
  active: Boolean
});

var EnvironmentConfig = new Schema({
  active: {
    type: Boolean,
    default: true
  },
  name: { type: String },
  manualTriggerBranch: {
    type: String,
    default: 'master'
  },
  phases: {
    deploy: {
      runOnFailedTests: {
        type: Boolean,
        default: false
      },
      runForPullRequests: {
        type: Boolean,
        default: false
      }
    }
  },
  sshKeys: {
    useGlobalKeys: {
      type: Boolean,
      default: true
    },
    addToEnv: Boolean,
    public: String,
    private: String
  },
  // job & runner plugins
  plugins: [PluginConfig],
  sources: [SourceConfig],
  runner: {
    id: String,
    config: {}
  },
  // for persistance, not configuration
  pluginData: {}
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

  environments: [EnvironmentConfig],
  provider: {
    id: String,      // plugin id of the provider
    account: String, // account id
    repo_id: String, // id of the repository
    config: {        // decided by the provider
      // url: String
    }
  }
});

// name: the name of the new environment
// done(err)
ProjectSchema.method('addEnvironment', function (name, done) {
  var environment = { name };

  this.environments.push(environment);

  this.collection.update({ _id: this._id }, {
    $push: { environments: environment }
  }, function (err, changed) {
    if (err) {
      return done(err);
    }

    if (!changed) {
      return done(new Error('no projects affected by adding the environment'));
    }

    done(null, environment);
  });
});

/**
 * Create a new environment by cloning it from an existing one.
 * 
 * @param {String} name The name of the new cloned environment
 * @param {String} cloneId The id of the environment to clone from
 * @param {Function} done The done callback
 */
ProjectSchema.method('cloneEnvironment', function (name, cloneId, done) {
  var clone;

  this.environments.forEach(function (environment) {
    if (environment.id === cloneId) {
      clone = _.merge({}, environment);
    }
  });

  if (!clone) {
    return done(new Error('source environment can not be found for cloning'));
  }

  clone.name = name;
  this.environments.push(clone);

  this.collection.update({ _id: this._id }, {
    $push: { environments: clone }
  }, function (err, changed) {
    if (err) {
      return done(err);
    }

    if (!changed) {
      return done(new Error('no projects affected by cloning the environment'));
    }

    done(null, clone);
  });
});

ProjectSchema.method('environment', function (name) {
  return findEnvironment(this.environments, name);
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
