'use strict';

var $ = require('jquery');
var _ = require('lodash');
var md5 = require('MD5');
var bootbox = require('bootbox');
var post = require('../../utils/post');
var branches = global.branches || [];
var project = global.project || {};
var plugins = global.plugins || {};
var runners = global.runners || {};
var userIsCreator = global.userIsCreator || false;
var userConfigs = global.userConfigs || {};
var statusBlocks = global.statusBlocks || {};

function ConfigController($scope, $element, $sce) {
  // this is the parent controller.
  $scope.project = project;
  $scope.plugins = plugins;
  $scope.runners = runners;
  $scope.userIsCreator = userIsCreator;
  $scope.userConfigs = userConfigs;
  $scope.statusBlocks = statusBlocks;
  $scope.configured = {};
  $scope.branch = $scope.project.branches[0];
  $scope.branches = branches;
  $scope.disabled_plugins = {};
  $scope.configs = {};
  $scope.runnerConfigs = {};
  $scope.api_root = '/' + $scope.project.name + '/api/';
  $scope.page = 'config';

  $(function ConfigPageRouting() {
    var router = {
      init: function () {
        var self = this;

        // Set the URL when a tab is selected
        $('a[data-toggle="tab"]').on('show', function (e) {
          var tabName = $(e.target).attr('href').replace('#', '');
          var rootPath = global.location.pathname.split('/').slice(0, 4).join('/');
          var state = global.history.state;

          if (state && state.tabName === tabName) {
            return; // don't double up!
          }

          global.history.pushState({ tabName: tabName }, global.document.title, rootPath + '/' + tabName);
        });

        // support the back button
        global.onpopstate = function () {
          self.route(); 
        };

        this.route();
      },

      route: function () {
        var pathParts = global.location.pathname.split('/');

        // Confirm we're on the config page
        if (pathParts.slice(0, 4)[3] === 'config') {
          this.routeConfigPage(pathParts);
        }
      },

      routeConfigPage: function (pathParts) {
        // Check the SessionStore to see if we should select a branch
        var branchName = global.sessionStorage.getItem('branchName');

        if (branchName) {
          switchToBranch(branchName);
        }
        else {
          global.sessionStorage.removeItem('branchName');
        }

        // Check the URL to see if we should go straight to a tab
        var lastPart = pathParts[pathParts.length-1];
        var tabName;

        if (pathParts.length === 5 && lastPart.length) {
          // Yes a tab was supplied
          tabName = lastPart;
          switchToTab(tabName, $scope.branch);
        }
      }
    }

    router.init()
  });

  function switchToBranch(name) {
    var branch = _.findWhere($scope.branches, { name: name });

    if (branch) {
      $scope.branch = branch;
    }

    global.sessionStorage.setItem('branchName', $scope.branch.name);
    switchToTab(null, $scope.branch);
  }

  $scope.switchToBranch = switchToBranch;

  function switchToTab(tab, branch) {
    if (!_.isString(tab)) {
      tab = branch && branch.name === 'master' ? 'tab-project' : 'tab-basic';
    }

    $('#' + tab + '-tab-handle').tab('show');
    $('.tab-pane.active').removeClass('active');
    $('#' + tab).addClass('active');
    $('a[href=#' + tab + ']').tab('show');
  }

  // When a tab is shown, reload any CodeMirror instances within
  $('[data-toggle=tab]').on('shown', function (e) {
    var tabId = $(e.target).attr('href');
    $(tabId).find('[ui-codemirror]').trigger('refresh');
  });

  $scope.switchToTab = switchToTab;

  var save_branches = {};

  $scope.refreshBranches = function () {
    // TODO implement
    throw new Error('Not implemented');
  };

  $scope.setEnabled = function (plugin, enabled) {
    $scope.configs[$scope.branch.name][plugin].enabled = enabled;
    savePluginOrder();
  };

  $scope.savePluginOrder = savePluginOrder;

  $scope.switchToMaster = function () {
    for (var i = 0; i < $scope.project.branches.length; i++) {
      if ($scope.project.branches[i].name === 'master') {
        $scope.branch = $scope.project.branches[i];
        return;
      }
    }
  };

  $scope.clearCache = function () {
    $scope.clearingCache = true;
    $.ajax('/' + $scope.project.name + '/cache', {
      type: 'DELETE',
      success: function () {
        $scope.clearingCache = false;
        $scope.success('Cleared the cache', true);
      },
      error: function () {
        $scope.clearingCache = false;
        $scope.error('Failed to clear the cache', true);
      }
    });
  };

  $scope.toggleBranch = function () {
    if ($scope.branch.mirror_master) {
      $scope.branch.mirror_master = false;

      var name = $scope.branch.name;
      var master;

      for (var i = 0; i < $scope.project.branches.length; i++) {
        if ($scope.project.branches[i].name === 'master') {
          master = $scope.project.branches[i];
          break;
        }
      }

      $scope.branch = $.extend(true, $scope.branch, master);
      $scope.branch.name = name;
      initBranch($scope.branch);
    }

    $scope.saveGeneralBranch(true);
  };

  $scope.mirrorMaster = function () {
    $scope.branch.mirror_master = true;
    delete $scope.branch.really_mirror_master;
    $scope.saveGeneralBranch(true);
  };

  $scope.setRunner = function (name) {
    var config = $scope.runnerConfigs[name]

    $scope.branch.runner.id = name;
    $scope.branch.runner.config = config;
    $scope.saveRunner(name, config);
  };

  function updateConfigured() {
    var plugins = $scope.branch.plugins;

    $scope.configured[$scope.branch.name] = {};

    for (var i = 0; i < plugins.length; i++) {
      $scope.configured[$scope.branch.name][plugins[i].id] = true;
    }

    savePluginOrder();
  }

  function savePluginOrder() {
    var plugins = $scope.branch.plugins;
    var branch = $scope.branch;
    var data = [];

    for (var i = 0; i < plugins.length; i++) {
      data.push({
        id: plugins[i].id,
        enabled: plugins[i].enabled,
        showStatus: plugins[i].showStatus
      });
    }

    $.ajax({
      url: '/' + $scope.project.name + '/config/branch/?branch=' + encodeURIComponent($scope.branch.name),
      type: 'PUT',
      data: JSON.stringify({ plugin_order: data }),
      contentType: 'application/json',
      success: function (data, ts, xhr) {
        $scope.success('Plugin order on branch ' + branch.name + ' saved.', true);
      },
      error: function (xhr, ts, e) {
        if (xhr && xhr.responseText) {
          $scope.error('Error saving plugin order on branch ' + branch.name + ': ' + xhr.responseText, true);
        } else {
          $scope.error('Error saving plugin order on branch ' + branch.name + ': ' + e, true);
        }
      }
    });
  }

  $scope.reorderPlugins = function (list) {
    $scope.branch.plugins = list;
    savePluginOrder();
  };

  $scope.enablePlugin = function (target, index, event) {
    removeDragEl(event.target);
    // add to enabled list
    $scope.branch.plugins.splice(index, 0, target);
    // enable it
    _.find($scope.branch.plugins, { id: target.id }).enabled = true;
    // remove from disabled list
    var disabled = $scope.disabled_plugins[$scope.branch.name];
    disabled.splice(_.indexOf(_.pluck(disabled, 'id'), target.id), 1);
    updateConfigured();
  };

  $scope.disablePlugin = function (target, index, event) {
    removeDragEl(event.target);
    // add it to the disabled list
    $scope.disabled_plugins[$scope.branch.name].splice(index, 0, target);
    // remove it from enabled list
    var enabled = $scope.branch.plugins;
    enabled.splice(_.indexOf(_.pluck(enabled, 'id'), target.id), 1);
    updateConfigured();
  };

  $scope.setImgStyle = function (pluginInfo) {
    var pluginId = pluginInfo.id;
    var plugins = $scope.plugins;
    var plugin = plugins[pluginId];
    var icon, iconBg;

    if (plugin) {
      icon = plugin.icon;

      if (icon) {
        iconBg = 'url(\'/ext/' + pluginId + '/' + icon + '\')';
      }
    }

    pluginInfo.imgStyle = {
      'background-image': iconBg
    };
  };

  function initBranch(branch) {
    var plugins;

    $scope.configured[branch.name] = {};
    $scope.configs[branch.name] = {};
    $scope.runnerConfigs[branch.name] = {};
    $scope.disabled_plugins[branch.name] = [];

    if (!branch.mirror_master) {
      plugins = branch.plugins;

      for (var i = 0; i < plugins.length; i++) {
        $scope.configured[branch.name][plugins[i].id] = true;
        $scope.configs[branch.name][plugins[i].id] = plugins[i];
      }
    }

    for (var plugin in $scope.plugins) {
      if ($scope.configured[branch.name][plugin]) {
        continue;
      }

      $scope.configs[branch.name][plugin] = {
        id: plugin,
        enabled: true,
        config: {}
      };

      $scope.disabled_plugins[branch.name].push($scope.configs[branch.name][plugin]);
    }

    if (!branch.mirror_master) {
      $scope.runnerConfigs[branch.name][branch.runner.id] = branch.runner.config;
    }

    for (var runner in $scope.runners) {
      if (!branch.mirror_master && runner === branch.runner.id) {
        continue;
      }

      $scope.runnerConfigs[branch.name][runner] = {};
    }
  }

  function initPlugins() {
    var branches = $scope.project.branches;

    for (var i = 0; i < branches.length; i++) {
      initBranch(branches[i]);
    }
  }

  $scope.saveGeneralBranch = function (plugins) {
    var branch = $scope.branch;
    var data = {
      active: branch.active,
      privkey: branch.privkey,
      pubkey: branch.pubkey,
      envKeys: branch.envKeys,
      mirror_master: branch.mirror_master,
      deploy_on_green: branch.deploy_on_green,
      runner: branch.runner
    };

    if (plugins) {
      data.plugins = branch.plugins;
    }

    $.ajax({
      url: '/' + $scope.project.name + '/config/branch/?branch=' + encodeURIComponent($scope.branch.name),
      type: 'PUT',
      data: JSON.stringify(data),
      contentType: 'application/json',
      success: function (data, ts, xhr) {
        $scope.success('General config for branch ' + branch.name + ' saved.', true);
      },
      error: function (xhr, ts, e) {
        if (xhr && xhr.responseText) {
          $scope.error('Error saving general config for branch ' + branch.name + ': ' + xhr.responseText, true);
        } else {
          $scope.error('Error saving general config for branch ' + branch.name + ': ' + e, true);
        }
      }
    });
  };

  $scope.generateKeyPair = function () {
    bootbox.confirm('Really generate a new keypair? This could break things if you have plugins that use the current ones.', function (really) {
      if (!really) {
        return;
      }

      $.ajax('/' + $scope.project.name + '/keygen/?branch=' + encodeURIComponent($scope.branch.name), {
        type: 'POST',
        success: function (data, ts, xhr) {
          $scope.branch.privkey = data.privkey;
          $scope.branch.pubkey = data.pubkey;
          $scope.success('Generated new ssh keypair', true);
        }
      });
    });
  };

  initPlugins();

  $scope.gravatar = function (email) {
    if (!email) {
      return '';
    }

    var hash = md5(email.toLowerCase());
    return 'https://secure.gravatar.com/avatar/' + hash + '?d=identicon';
  }

  $scope.saveRunner = function (id, config) {
    $.ajax({
      url: '/' + $scope.project.name + '/config/branch/runner/id/?branch=' + encodeURIComponent($scope.branch.name),
      data: JSON.stringify({id: id, config: config}),
      contentType: 'application/json',
      type: 'PUT',
      success: function () {
        // TODO indicate to the user?
        $scope.success('Saved runner config.', true);
      },
      error: function (xhr, ts, e) {
        if (xhr && xhr.responseText) {
          var data = $.parseJSON(xhr.responseText);
          $scope.error('Error setting runner id to ' + id);
        }
      }
    });
  };

  // todo: pass in name?
  $scope.runnerConfig = function (branch, data, next) {
    if (arguments.length === 2) {
      next = data;
      data = branch;
      branch = $scope.branch;
    }

    var name = $scope.branch.runner.id;

    if (arguments.length < 2) {
      return $scope.runnerConfigs[name];
    }

    $.ajax({
      url: '/' + $scope.project.name + '/config/branch/runner/?branch=' + encodeURIComponent($scope.branch.name),
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function (data, ts, xhr) {
        $scope.success('Runner config saved.');
        $scope.runnerConfigs[name] = data.config;
        next(null, data.config);
        $scope.$root.$digest();
      },
      error: function (xhr, ts, e) {
        if (xhr && xhr.responseText) {
          var data = $.parseJSON(xhr.responseText);
          $scope.error('Error saving runner config: ' + data.errors[0]);
        } else {
          $scope.error('Error saving runner config: ' + e);
        }

        next();
        $scope.$root.$digest();
      }
    });
  };

  $scope.providerConfig = function (data, next) {
    if (arguments.length === 0) {
      return $scope.project.provider.config;
    }

    $.ajax({
      url: '/' + $scope.project.name + '/provider/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function (data, ts, xhr) {
        $scope.success('Provider config saved.');
        next && next();
        $scope.$root.$digest();
      },
      error: function (xhr, ts, e) {
        if (xhr && xhr.responseText) {
          $scope.error('Error saving provider config: ' + xhr.responseText);
        } else {
          $scope.error('Error saving provider config: ' + e);
        }

        next && next();
        $scope.$root.$digest();
      }
    });
  };

  $scope.pluginConfig = function (name, branch, data, next) {
    if (arguments.length === 3) {
      next = data;
      data = branch;
      branch = $scope.branch;
    }

    if (arguments.length === 1) {
      branch = $scope.branch;
    }

    if (branch.mirror_master) {
      return;
    }

    var plugin = $scope.configs[branch.name][name];

    if (arguments.length < 3) {
      return plugin.config;
    }

    if (plugin === null) {
      console.error('pluginConfig called for a plugin that\'s not configured. ' + name, true);
      throw new Error('Plugin not configured: ' + name);
    }

    $.ajax({
      url: '/' + $scope.project.name + '/config/branch/' + name + '/?branch=' + encodeURIComponent(branch.name),
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function (data, ts, xhr) {
        $scope.success('Config for ' + name + ' on branch ' + branch.name + ' saved.');
        $scope.configs[branch.name][name].config = data;
        next(null, data);
        $scope.$root.$digest();
      },
      error: function (xhr, ts, e) {
        if (xhr && xhr.responseText) {
          var data = $.parseJSON(xhr.responseText);
          $scope.error('Error saving ' + name + ' config on branch ' + branch.name + ': ' + data.errors[0]);
        } else {
          $scope.error('Error saving ' + name + ' config on branch ' + branch.name + ': ' + e);
        }

        next();
        $scope.$root.$digest();
      }
    });
  };

  $scope.deleteProject = function () {
    $.ajax({
      url: '/' + $scope.project.name + '/',
      type: 'DELETE',
      success: function () {
        global.location = '/';
      },
      error: function () {
        $scope.deleting = false;
        $scope.error('failed to remove project', true);
      }
    });
  };

  // TODO: where is name coming from, I guessed it's from the params
  $scope.startTest = function (name) {
    $.ajax({
      url: '/' + $scope.project.name + '/start',
      data:{ branch: $scope.branch.name, type: 'TEST_ONLY', page: 'config' },
      type: 'POST',
      success: function () {
        global.location = '/' + $scope.project.name + '/';
      },
      error: function (xhr, ts, e) {
        if (xhr && xhr.responseText) {
          var data = $.parseJSON(xhr.responseText);
          $scope.error('Error starting test job for ' + name + ' on branch ' + $scope.branch.name + ': ' + data.errors[0]);
        }
      }
    });
  };

  // TODO: where is name coming from, I guessed it's from the params
  $scope.startDeploy = function (name) {
    $.ajax({
      url: '/' + $scope.project.name + '/start',
      data:{ branch: $scope.branch.name, type: 'TEST_AND_DEPLOY', page: 'config' },
      type: 'POST',
      success: function () {
        global.location = '/' + $scope.project.name + '/';
      },
      error: function (xhr, ts, e) {
        if (xhr && xhr.responseText) {
          var data = $.parseJSON(xhr.responseText);
          $scope.error('Error starting deploy job for ' + name + ' on branch ' + $scope.branch.name + ': ' + data.errors[0]);
        }
      }
    });
  };

  $scope.saveProject = function () {
    $.ajax({
      url: '/' + $scope.project.name + '/config',
      type: 'PUT',
      data: JSON.stringify({
        public: $scope.project.public
      }),
      contentType: 'application/json',
      success: function (data, ts, xhr) {
        $scope.success('General config saved.', true);
      },
      error: function (xhr, ts, e) {
        if (xhr && xhr.responseText) {
          $scope.error('Error saving general config: ' + xhr.responseText, true);
        } else {
          $scope.error('Error saving general config: ' + e, true);
        }
      }
    });
  };

  $scope.post = post;
}

function removeDragEl(element) {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

module.exports = ConfigController;
