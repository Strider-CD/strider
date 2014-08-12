/* global app: true, console: true, md5: true, bootbox: true, ngSortableDirective: true */

;(function () {

  window.app = angular.module('config', ['ui.bootstrap', 'ui.codemirror', 'ui.sortable', 'Alerts', 'moment'], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  })
  .directive('ngSortable', ngSortableDirective);

  function post(url, data, done) {
    $.ajax({
      url: url,
      type: 'POST',
      data: data,
      dataType: 'json',
      success: function (data, ts, xhr) {
        done(null);
      },
      error: function (xhr, ts, e) {
        if (xhr && xhr.responseText) {
          var data = $.parseJSON(xhr.responseText);
          e = data.errors[0];
        }
        done(e);
      }
    });
  }

  app.controller('RunnerController', ['$scope', '$element', function ($scope, $element) {
    var name = $element.attr('id').split('-').slice(1).join('-');
    $scope.saving = false;
    $scope.$watch('runnerConfigs[branch.name]["' + name + '"]', function (value) {
      // console.debug('Runner config', name, value, $scope.runnerConfigs);
      $scope.config = value;
    });
    $scope.save = function () {
      $scope.saving = true;
      $scope.runnerConfig($scope.config, function () {
        $scope.saving = false;
      });
    };
  }]);

  app.controller('ProviderController', ['$scope', function ($scope) {
    $scope.config = $scope.providerConfig();
    $scope.saving = false;
    $scope.save = function () {
      $scope.saving = true;
      $scope.providerConfig($scope.config, function () {
        $scope.saving = false;
      });
    };
  }]);

  app.controller('JobController', ['$scope', '$element', function ($scope, $element) {
    var name = $element.attr('id').split('-').slice(1).join('-');
    $scope.$watch('userConfigs["' + name + '"]', function (value) {
      $scope.userConfig = value;
    });
    $scope.$watch('configs[branch.name]["' + name + '"].config', function (value) {
      $scope.config = value;
    });
    $scope.saving = false;
    $scope.save = function () {
      $scope.saving = true;
      $scope.pluginConfig(name, $scope.config, function () {
        $scope.saving = false;
      });
    };
  }]);

  app.controller('Config', ['$scope', '$element', '$sce', function ($scope, $element, $sce) {
    // this is the parent controller.
    $scope.project = window.project || {};
    $scope.plugins = window.plugins || {};
    $scope.runners = window.runners || {};
    $scope.userIsCreator = window.userIsCreator || false;
    $scope.userConfigs = window.userConfigs || {};
    $scope.statusBlocks = window.statusBlocks || {};
    $scope.configured = {};
    $scope.branch = $scope.project.branches[0];
    $scope.branches = window.branches || [];
    $scope.disabled_plugins = {};
    $scope.configs = {};
    $scope.runnerConfigs = {};
    $scope.api_root = '/' + $scope.project.name + '/api/';
    $scope.page = 'config';

    $(function ConfigPageRouting() {
      var router = {
        init: function () {
          // Set the URL when a tab is selected
          $('a[data-toggle="tab"]').on('show', function (e) {
            var tabName = $(e.target).attr('href').replace('#', '');
            var rootPath = window.location.pathname.split('/').slice(0, 4).join('/');
            var state = window.history.state;
            if (state && state.tabName === tabName) return; // don't double up!
            window.history.pushState({ tabName: tabName }, document.title, rootPath+'/'+tabName)
          });
          window.onpopstate = this.route; // support the back button
          this.route();
        },
        route: function() {
          var pathParts = window.location.pathname.split('/');
          // Confirm we're on the config page
          if (pathParts.slice(0, 4)[3] === "config") {
            this.routeConfigPage(pathParts)
          }
        },
        routeConfigPage: function (pathParts) {
          // Check the SessionStore to see if we should select a branch
          var branchName = sessionStorage.getItem('branchName')
          if (branchName) switchToBranch(branchName);
          else sessionStorage.removeItem('branchName');
          // Check the URL to see if we should go straight to a tab
          var lastPart = pathParts[pathParts.length-1];
          if (pathParts.length === 5 && lastPart.length) {
            // Yes a tab was supplied
            var tabName = lastPart;
            switchToTab(tabName, $scope.branch);
          }
        }
      }
      router.init()
    });
    
    function switchToBranch(name) {
      var branch = _.findWhere($scope.branches, { name: name });
      if (branch) $scope.branch = branch;
      sessionStorage.setItem('branchName', $scope.branch.name);
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

    $scope.switchToTab = switchToTab;

    var save_branches = {};

    $scope.refreshBranches = function () {
      // TODO implement
      throw Error('Not implemented');
    };

    $scope.setEnabled = function (plugin, enabled) {
      $scope.configs[$scope.branch.name][plugin].enabled = enabled;
      savePluginOrder();
    };

    $scope.savePluginOrder = savePluginOrder;

    $scope.switchToMaster = function () {
      for (var i=0; i<$scope.project.branches.length; i++) {
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
    }

    $scope.toggleBranch = function () {
      if ($scope.branch.mirror_master) {
        $scope.branch.mirror_master = false;
        var name = $scope.branch.name
          , master;
        for (var i=0; i<$scope.project.branches.length; i++) {
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
      $scope.saveRunner(name, config)
    };

    function updateConfigured() {
      var plugins = $scope.branch.plugins;
      $scope.configured[$scope.branch.name] = {};
      for (var i=0; i<plugins.length; i++) {
        $scope.configured[$scope.branch.name][plugins[i].id] = true;
      }
      savePluginOrder();
    }

    function savePluginOrder() {
      var plugins = $scope.branch.plugins
        , branch = $scope.branch
        , data = [];
      for (var i=0; i<plugins.length; i++) {
        data.push({
          id: plugins[i].id,
          enabled: plugins[i].enabled,
          showStatus: plugins[i].showStatus
        });
      }
      $.ajax({
        url: '/' + $scope.project.name + '/config/branch/?branch=' + encodeURIComponent($scope.branch.name),
        type: 'PUT',
        data: JSON.stringify({plugin_order: data}),
        contentType: 'application/json',
        success: function(data, ts, xhr) {
          $scope.success('Plugin order on branch ' + branch.name + ' saved.', true);
        },
        error: function(xhr, ts, e) {
          if (xhr && xhr.responseText) {
            $scope.error("Error saving plugin order on branch " + branch.name + ": " + xhr.responseText, true);
          } else {
            $scope.error("Error saving plugin order on branch " + branch.name + ": " + e, true);
          }
        }
      });
    }

    $scope.reorderPlugins = function(list) {
      $scope.branch.plugins = list;
      savePluginOrder();
    };

    $scope.enablePlugin = function (target, index, event) {
      event.removeDragEl();
      // add to enabled list
      $scope.branch.plugins.splice(index, 0, target);
      // enable it
      _.find($scope.branch.plugins, { id: target.id }).enabled = true;
      // remove from disabled list
      var disabled = $scope.disabled_plugins[$scope.branch.name];
      disabled.splice(_.indexOf(_.pluck(disabled, 'id'), target.id), 1);
      updateConfigured()
    };

    $scope.disablePlugin = function (target, index, event) {
      event.removeDragEl();
      // add it to the disabled list
      $scope.disabled_plugins[$scope.branch.name].splice(index, 0, target);
      // remove it from enabled list
      var enabled = $scope.branch.plugins;
      enabled.splice(_.indexOf(_.pluck(enabled, 'id'), target.id), 1);
      updateConfigured()
    };

    $scope.setImgStyle = function (plugin) {
      var plugins = $scope.plugins
        , icon = plugins[plugin.id].icon
        , bg = null;
      if (icon)
        bg = "url('/ext/"+plugin.id+"/"+plugins[plugin.id].icon+"')";
      plugin.imgStyle = {
        'background-image': bg
      }
    };

    function initBranch(branch) {
      var plugins;

      $scope.configured[branch.name] = {};
      $scope.configs[branch.name] = {};
      $scope.runnerConfigs[branch.name] = {};
      $scope.disabled_plugins[branch.name] = [];

      if (!branch.mirror_master) {
        plugins = branch.plugins;
        for (var i=0; i<plugins.length; i++) {
          $scope.configured[branch.name][plugins[i].id] = true;
          $scope.configs[branch.name][plugins[i].id] = plugins[i];
        }
      }

      for (var plugin in $scope.plugins) {
        if ($scope.configured[branch.name][plugin]) continue;
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
        if (!branch.mirror_master && runner === branch.runner.id) continue;
        $scope.runnerConfigs[branch.name][runner] = {};
      }
    }
    function initPlugins() {
      var branches = $scope.project.branches
      for (var i=0; i<branches.length; i++) {
        initBranch(branches[i]);
      }
    }

    $scope.saveGeneralBranch = function (plugins) {
      var branch = $scope.branch
        , data = {
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
        success: function(data, ts, xhr) {
          $scope.success('General config for branch ' + branch.name + ' saved.', true);
        },
        error: function(xhr, ts, e) {
          if (xhr && xhr.responseText) {
            $scope.error("Error saving general config for branch " + branch.name + ": " + xhr.responseText, true);
          } else {
            $scope.error("Error saving general config for branch " + branch.name + ": " + e, true);
          }
        }
      });
    };

    $scope.generateKeyPair = function () {
      bootbox.confirm('Really generate a new keypair? This could break things if you have plugins that use the current ones.', function (really) {
        if (!really) return;
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
      if (!email) return '';
      var hash = md5(email.toLowerCase());
      return 'https://secure.gravatar.com/avatar/' + hash + '?d=identicon';
    }

    $scope.saveRunner = function (id, config) {
      $.ajax({
        url: '/' + $scope.project.name + '/config/branch/runner/id/?branch=' + encodeURIComponent($scope.branch.name),
        data: JSON.stringify({id: id, config: config}),
        contentType: 'application/json',
        type: 'PUT',
        success: function() {
          // TODO indicate to the user?
          $scope.success('Saved runner config.', true);
        },
        error: function(xhr, ts, e) {
          if (xhr && xhr.responseText) {
            var data = $.parseJSON(xhr.responseText);
            $scope.error("Error setting runner id to " + id);
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
        success: function(data, ts, xhr) {
          $scope.success("Runner config saved.");
          $scope.runnerConfigs[name] = data.config;
          next(null, data.config);
          $scope.$root.$digest();
        },
        error: function(xhr, ts, e) {
          if (xhr && xhr.responseText) {
            var data = $.parseJSON(xhr.responseText);
            $scope.error("Error saving runner config: " + data.errors[0]);
          } else {
            $scope.error("Error saving runner config: " + e);
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
        success: function(data, ts, xhr) {
          $scope.success("Provider config saved.");
          next && next();
          $scope.$root.$digest();
        },
        error: function(xhr, ts, e) {
          if (xhr && xhr.responseText) {
            $scope.error("Error saving provider config: " + xhr.responseText);
          } else {
            $scope.error("Error saving provider config: " + e);
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
        return
      }
      var plugin = $scope.configs[branch.name][name]
      if (arguments.length < 3) {
        return plugin.config;
      }
      if (plugin === null) {
        console.error("pluginConfig called for a plugin that's not configured. " + name, true);
        throw new Error('Plugin not configured: ' + name);
      }
      $.ajax({
        url: '/' + $scope.project.name + '/config/branch/' + name + '/?branch=' + encodeURIComponent(branch.name),
        type: "PUT",
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(data, ts, xhr) {
          $scope.success("Config for " + name + " on branch " + branch.name + " saved.");
          $scope.configs[branch.name][name].config = data;
          next(null, data);
          $scope.$root.$digest();
        },
        error: function(xhr, ts, e) {
          if (xhr && xhr.responseText) {
            var data = $.parseJSON(xhr.responseText);
            $scope.error("Error saving " + name + " config on branch " + branch.name + ": " + data.errors[0]);
          } else {
            $scope.error("Error saving " + name + " config on branch " + branch.name + ": " + e);
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
          window.location = '/';
        },
        error: function () {
          $scope.deleting = false;
          $scope.error('failed to remove project', true);
        }
      });
    };

    $scope.startTest = function () {
      $.ajax({
        url: '/' + $scope.project.name + '/start',
        data:{branch: $scope.branch.name, type: "TEST_ONLY", page:"config"},
        type: 'POST',
        success: function() {
          window.location = '/' + $scope.project.name + '/';
        },
        error: function(xhr, ts, e) {
          if (xhr && xhr.responseText) {
            var data = $.parseJSON(xhr.responseText);
            $scope.error("Error starting test job for " + name + " on branch " + $scope.branch.name + ": " + data.errors[0]);
          }
        }
      });
    };

    $scope.startDeploy = function () {
      $.ajax({
        url: '/' + $scope.project.name + '/start',
        data:{branch: $scope.branch.name, type: "TEST_AND_DEPLOY", page:"config"},
        type: 'POST',
        success: function() {
          window.location = '/' + $scope.project.name + '/';
        },
        error: function(xhr, ts, e) {
          if (xhr && xhr.responseText) {
            var data = $.parseJSON(xhr.responseText);
            $scope.error("Error starting deploy job for " + name + " on branch " + $scope.branch.name + ": " + data.errors[0]);
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
        success: function(data, ts, xhr) {
          $scope.success('General config saved.', true);
        },
        error: function(xhr, ts, e) {
          if (xhr && xhr.responseText) {
            $scope.error("Error saving general config: " + xhr.responseText, true);
          } else {
            $scope.error("Error saving general config: " + e, true);
          }
        }
      });
    };

    $scope.post = post;
  }]);

})();
