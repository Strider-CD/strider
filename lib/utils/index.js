'use strict';

var gravatar = require('gravatar');
var crypto = require('crypto');
var _ = require('lodash');
var extend = require('extend');

module.exports = {
  gravatar: gravatarDefault,
  sanitizeProject: sanitizeProject,
  sanitizeBranch: sanitizeBranch,
  sanitizeUser: sanitizeUser,
  timeFromId: timeFromId,
  defaultSchema: defaultSchema,
  validateAgainstSchema: validateAgainstSchema,
  mergePlugins: mergePlugins,
  mergeConfigs: mergeConfigs,
  findBranch: findBranch
};

function findBranch(branches, name) {
  var foundBranch = false;
  branches.some(function (branch) {
    if (branch.name) {
      var regEx = new RegExp('^' + branch.name.replace(/\*/g, '.*') + '$');
      if (regEx.test(name)) {
        foundBranch = branch;
        return true;
      }
    }
  });
  return (function discreteBranchFn(name, branch, branches) {
    //console.log('findBranch('+name+') wants to return '+branch.name);
    if (branch.name !== name) {
      //console.warn('Possibly returning unintended branch (expected '+name+' but got '+branch.name+'). attempting to locate discretely named branch '+name+' if it exists.');
      var discreteBranch = _.findWhere(branches, {name: name});
      if (discreteBranch) {
        branch = discreteBranch;
        //console.info("Located discrete branch, instead returning "+branch.name)
      } else {
        //console.warn("Unable to find discrete branch "+name+", still returning "+branch.name);
      }
    }
    return branch;
  }(name, foundBranch, branches));
}

// merge plugins from the DB with ones from strider.json. The latter overrides the former
function mergePlugins(branch, sjson) {
  if (!branch) return sjson;
  if (!sjson) return branch;
  // if strict_plugins is not turned on, we merge each plugin config instead of overwriting.
  var plugins = [];
  var pluginMap = {};

  for (var pluginIndex = 0; pluginIndex < sjson.length; pluginIndex++) {
    plugins.push(sjson[pluginIndex]);
    pluginMap[sjson[pluginIndex].id] = true;
  }
  for (var branchIndex = 0; branchIndex < branch.length; branchIndex++) {
    if (!pluginMap[branch[branchIndex].id]) plugins.push(branch[branchIndex]);
  }
  return plugins;
}

function mergeConfigs(branch, sjson) {
  var config = extend({}, branch, sjson);
  if (!sjson.merge_plugins) return config;
  config.plugins = mergePlugins(branch.plugins, sjson.plugins);
  return config;
}

function validateVal(val, schema) {
  if (schema === String) return val + '';
  if (schema === Number) {
    val = parseFloat(schema);
    return isNaN(val) ? 0 : val;
  }
  if (schema === Boolean) return !!val;
  if (Array.isArray(schema)) {
    var ret = [];
    if (!Array.isArray(val)) return [];
    for (var i = 0; i < val.length; i++) {
      ret.push(validateVal(val[i], schema[0]));
    }
    return ret;
  }
  if (schema.type && !schema.type.type) {
    val = validateVal(val, schema.type);
    if (schema.enum && schema.enum.indexOf(val) === -1) {
      return;
    }
    return val;
  }
  if ('object' !== typeof schema) return;
  if ('object' !== typeof val) return {};
  // if schema is {}, it's unchecked.
  if (Object.keys(schema).length === 0) return val;
  return validateAgainstSchema(val, schema);
}

function defaultVal(val) {
  if (val === String) return '';
  if (val === Number) return 0;
  if (val === Boolean) return false;
  if (!val) return null;
  if (Array.isArray(val)) return [];
  if (val.type && !val.type.type) {
    if (val.default) return val.default;
    if (val.enum) return val.enum[0];
    return defaultVal(val.type);
  }
  if ('object' === typeof val) return defaultSchema(val);
  return null;
}

function defaultSchema(schema) {
  var data = {};
  for (var key in schema) {
    data[key] = defaultVal(schema[key]);
  }
  return data;
}

function validateAgainstSchema(obj, schema) {
  var data = {};
  for (var key in obj) {
    if (!schema[key]) continue;
    data[key] = validateVal(obj[key], schema[key]);
  }
  return data;
}

function timeFromId(id) {
  return new Date(parseInt(id.toString().substring(0, 8), 16) * 1000);
}

function sanitizeBranch(branch) {
  var plugins = [];
  for (var i = 0; i < branch.plugins; i++) {
    plugins.push({id: branch.plugins[i].id, enabled: branch.plugins[i].enabled});
  }
  return {
    plugins: plugins,
    public: branch.public,
    active: branch.active,
    deploy_on_green: branch.deploy_on_green,
    deploy_on_pull_request: branch.deploy_on_pull_request,
    runner: {
      id: branch.runner && branch.runner.id
    }
  };
}

function sanitizeUser(user) {
  for (var i = 0; i < user.accounts.length; i++) {
    delete user.accounts[i].cache;
  }
  return user;
}

function sanitizeProject(project) {
  return {
    _id: project._id,
    name: project.name,
    branches: project.branches.map(sanitizeBranch),
    public: project.public,
    display_url: project.display_url,
    display_name: project.display_name,
    provider: {
      id: project.provider.id
    }
  };
}

function gravatarDefault(email) {
  return gravatar.url(email, {
    d: 'identicon'
  }, true);
}
