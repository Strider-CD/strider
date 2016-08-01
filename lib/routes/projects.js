'use strict';

var express = require('express');
var async = require('async');
var common = require('../common');
var models = require('../models');
var pjson = require('../../package.json');
var router = express.Router();
var Project = models.Project;
var User = models.User;
var debug = require('debug')('strider:routes');

router.route('/')
  .get(function (req, res) {
    return renderProjects(false, req, res);
  })
  .post(function (req, res) {
    var refresh = req.body.refresh !== 'false' && req.body.refresh !== '0';

    return renderProjects(refresh, req, res);
  });

module.exports = router;

function renderProjects(refresh, req, res) {
  var tasks = [];
  var repomap = {};
  var configured = {};
  var unconfigured = [];
  var providers = common.userConfigs.provider;
  var manual = {};
  var manualProjects = {};

  Object.keys(common.pluginConfigs.provider).forEach(function (key) {
    var config = common.pluginConfigs.provider[key];
    if (common.extensions.provider[key].hosted) return;
    manualProjects[key] = [];
    manual[key] = {
      provider: config,
      projects: manualProjects[key]
    };
  });

  Project.find({creator: req.user._id}).lean().exec(function (err, projects) {
    if (err) return res.send(500, 'Failed to get projects from the database');
    // tree is { providerid: { accountid: { repoid: project._id, ...}, ...}, ...}
    // to track which repos have been configured
    var tree = {};
    for (var i = 0; i < projects.length; i++) {
      var provider = projects[i].provider;
      if (!provider.account) {
        if (!manual[provider.id]) {
          manual[provider.id] = {
            provider: common.pluginConfigs.provider[provider.id],
            projects: []
          };
        }
        manual[provider.id].projects.push(projects[i]);
        continue;
      }
      deepObj(tree, provider.id, provider.account)[provider.repo_id] = {
        _id: projects[i]._id,
        name: projects[i].name
      };
    }

    req.user.accounts.forEach(function (account) {
      configured[account.provider] = true;

      // Caching
      var haveCache = Array.isArray(account.cache) && account.cache.length > 0;
      if (!refresh && haveCache) {
        groupRepos(account, repomap, tree, account.toJSON().cache);
        return;
      }

      tasks.push(function (next) {
        debug(`Now trying to list repos for the following provider for an account in the user model: ${account.provider}`);

        if (!common.extensions.provider[account.provider]) {
          next(new Error(`The plugin for ${account.provider} could not be found. Please install the plugin from Admin > Plugins`));
        } else {
          common.extensions.provider[account.provider].listRepos(account.config, function (err, repos) {
            if (err) {
              if (haveCache) {
                groupRepos(account, repomap, tree, account.toJSON().cache);
              }
              return next(err);
            }
            account.set('cache', repos);
            groupRepos(account, repomap, tree, repos);
            account.last_updated = new Date();
            next();
          });
        }
      });
    });
    for (var id in providers) {
      if (configured[id] || !providers[id].setupLink) continue;
      unconfigured.push(providers[id]);
    }
    debug('Fetching projects...');
    async.parallel(tasks, function (err) {
      if (err) {
        req.flash('account', `Failed to refresh repositories: ${(err.message || err)}`);
        debug(err);
      }
      // cache the fetched repos
      User.update({_id: req.user._id}, {$set: {accounts: req.user.toJSON().accounts}}, function (err, num) {
        if (err) console.error('error saving repo cache');
        if (!num) console.error('Didn\'t effect any users');
        debug('Saved repo cache');
        // user is already be available via the "currentUser" template variable

        return res.format({
          html: function () {
            res.render('projects.html', {
              unconfigured: unconfigured,
              providers: providers,
              manual: manual,
              manualProjects: manualProjects,
              repos: repomap,
              flash: req.flash(),
              project_types: availableProjectTypes(),
              version: pjson.version
            });
          },
          json: function () {
            res.send({
              unconfigured: unconfigured,
              providers: providers,
              manual: manual,
              manualProjects: manualProjects,
              repos: repomap,
              project_types: availableProjectTypes()
            });
          }
        });
      });
    });
  });
}

function availableProjectTypes() {
  var available = {};
  for (var id in common.project_types) {
    var good = true;
    var plugins = common.project_types[id].plugins;
    for (var i = 0; i < plugins.length; i++) {
      if (!common.extensions.job[plugins[i]]) {
        good = false;
        break;
      }
    }
    if (good) {
      available[id] = common.project_types[id];
    }
  }
  return available;
}

function groupRepos(account, repomap, tree, repos) {
  var groups = deepObj(repomap, account.provider, account.id);
  var projectmap = getDeep(tree, account.provider, account.id) || {};
  for (var i = 0; i < repos.length; i++) {
    if (!groups[repos[i].group]) {
      groups[repos[i].group] = {
        configured: 0,
        repos: []
      };
    }
    repos[i].project = projectmap[repos[i].id];
    groups[repos[i].group].repos.push(repos[i]);
    if (repos[i].project) {
      groups[repos[i].group].configured += 1;
    }
  }
}

function getDeep(obj) {
  return [].slice.call(arguments, 1).reduce(function (obj, name) {
    return obj && obj[name];
  }, obj);
}

function deepObj(obj) {
  var names = [].slice.call(arguments, 1);
  return names.reduce(function (obj, name) {
    return obj[name] || (obj[name] = {});
  }, obj);
}
