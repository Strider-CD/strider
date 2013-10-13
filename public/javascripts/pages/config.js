/* global app: true, console: true, md5: true, bootbox: true */

;(function () {

  window.app = angular.module('config', ['ui.bootstrap', 'ui.codemirror', 'ui.sortable', 'Alerts', 'moment'], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  });

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
      console.log('Runner config', name, value, $scope.runnerConfigs);
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
    $scope.statusBlocks = window.statusBlocks || {};
    $scope.configured = {};
    // TODO make this aware of a #hash ?
    $scope.branch = $scope.project.branches[0];
    $scope.branches = window.branches || [];
    $scope.disabled_plugins = {};
    $scope.configs = {};
    $scope.runnerConfigs = {};
    $scope.selectedTab = null;
    $scope.api_root = '/' + $scope.project.name + '/api/';

    $('a[data-toggle="tab"]').on('show', function (e) {
      $scope.selectedTab = e.target.href.slice(1);
      $scope.$digest();
    });

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
      } else {
        $scope.branch.mirror_master = true;
      }
      $scope.saveGeneralBranch(true);
    };

    $scope.$watch('branch.mirror_master', function (value) {
      setTimeout(function () {
        var tab = value && value.name === 'master' ? 'project' : 'basic';
        $('#' + tab + '-tab-handle').tab('show');
        $('.tab-pane.active').removeClass('active');
        $('#tab-' + tab).addClass('active');
      }, 0);
    });
    $scope.$watch('branch', function (value) {
      setTimeout(function () {
        var tab = value && value.name === 'master' ? 'project' : 'basic';
        $('#' + tab + '-tab-handle').tab('show');
        $('.tab-pane.active').removeClass('active');
        $('#tab-' + tab).addClass('active');
      }, 0);
    });

    $scope.setRunner = function (name) {
      $scope.branch.runner = {
        id: name,
        config: $scope.runnerConfigs[name]
      };
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
        url: '/' + $scope.project.name + '/config/' + $scope.branch.name + '/',
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

    // options for the inUse plugin sortable
    $scope.inUseOptions = {
      connectWith: '.disabled-plugins-list',
      distance: 5,
      remove: function (e, ui) {
        updateConfigured();
      },
      receive: function (e, ui) {
        updateConfigured();
        var plugins = $scope.branch.plugins;
        plugins[ui.item.index()].enabled = true;
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
            mirror_master: branch.mirror_master,
            deploy_on_green: branch.deploy_on_green,
            runner: branch.runner
          };
      if (plugins) {
        data.plugins = branch.plugins;
      }
      $.ajax({
        url: '/' + $scope.project.name + '/config/' + $scope.branch.name + '/',
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
        $.ajax('/' + $scope.project.name + '/keygen/' + $scope.branch.name, {
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
        url: '/' + $scope.project.name + '/config/master/runner',
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
        url: '/' + $scope.project.name + '/config/' + branch.name + "/" + name,
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
