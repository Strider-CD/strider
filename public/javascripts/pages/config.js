/* global app: true, console: true, md5: true */

;(function () {

  window.app = angular.module('config', ['ui.sortable'], function ($interpolateProvider) {
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
    $scope.$watch('runnerConfigs[branch]["' + name + '"]', function (value) {
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
    $scope.$watch('configs[branch]["' + name + '"].config', function (value) {
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
    $scope.message = null;
    $scope.project = window.project || {};
    $scope.plugins = window.plugins || {};
    $scope.runners = window.runners || {};
    $scope.configured = {};
    // TODO make this aware of a #hash ?
    $scope.branch = 'master';
    $scope.branches = window.branches || [];
    $scope.disabled_plugins = {};
    $scope.configs = {};
    $scope.runnerConfigs = {};

    var save_branches = {};

    $scope.refreshBranches = function () {
      // TODO implement
      throw Error('Not implemented');
    };

    $scope.setEnabled = function (plugin, enabled) {
      $scope.configs[$scope.branch][plugin].enabled = enabled;
      savePluginOrder();
    };

    $scope.switchToMaster = function () {
      $scope.branch = 'master';
    };

    $scope.toggleBranch = function () {
      if ($scope.branch === 'master') return;
      if ($scope.project.branches[$scope.branch] === 'master') {
        $scope.project.branches[$scope.branch] = save_branches[$scope.branch] || $.extend(true, {}, $scope.project.branches.master);
        initBranch($scope.branch);
      } else {
        save_branches[$scope.branch] = $scope.project.branches[$scope.branch];
        $scope.project.branches[$scope.branch] = 'master';
      }
    };

    $scope.$watch('branch', function (value) {
      setTimeout(function () {
      $('#' + (value === 'master' ? 'project' : 'basic') + '-tab-handle').tab('show');
      }, 0);
    });

    $scope.setRunner = function (name) {
      $scope.project.branches[$scope.branch].runner = {
        id: name,
        config: $scope.runnerConfigs[name]
      };
    };

    function updateConfigured() {
      var plugins = $scope.project.branches[$scope.branch].plugins;
      $scope.configured[$scope.branch] = {};
      for (var i=0; i<plugins.length; i++) {
        $scope.configured[$scope.branch][plugins[i].id] = true;
      }
      savePluginOrder();
    }

    function savePluginOrder() {
      var plugins = $scope.project.branches[$scope.branch].plugins
        , data = [];
      for (var i=0; i<plugins.length; i++) {
        data.push({
          id: plugins[i].id,
          enabled: plugins[i].enabled
        });
      }
      $.ajax({
        url: '/' + $scope.project.name + '/config/' + $scope.branch + '/',
        type: 'PUT',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function(data, ts, xhr) {
          $scope.success('Plugin order on branch ' + $scope.branch + ' saved.');
          $scope.$root.$digest();
        },
        error: function(xhr, ts, e) {
          if (xhr && xhr.responseText) {
            var data = $.parseJSON(xhr.responseText);
            $scope.error("Error saving plugin order on branch " + $scope.branch + ": " + data.errors[0]);
          } else {
            $scope.error("Error saving plugin order on branch " + $scope.branch + ": " + e);
          }
          $scope.$root.$digest();
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
        var plugins = $scope.project.branches[$scope.branch].plugins;
        plugins[ui.item.index()].enabled = true;
      }
    };

    function initBranch(branch) {
      var branches = $scope.project.branches
        , plugins;

      $scope.configured[branch] = {};
      $scope.configs[branch] = {};
      $scope.runnerConfigs[branch] = {};
      $scope.disabled_plugins[branch] = [];

      if (branches[branch] !== 'master') {
        plugins = branches[branch].plugins;
        for (var i=0; i<plugins.length; i++) {
          $scope.configured[branch][plugins[i].id] = true;
          $scope.configs[branch][plugins[i].id] = plugins[i];
        }
      }

      for (var plugin in $scope.plugins) {
        if ($scope.configured[branch][plugin]) continue;
        $scope.configs[branch][plugin] = {
          id: plugin,
          enabled: true,
          config: {}
        };
        $scope.disabled_plugins[branch].push($scope.configs[branch][plugin]);
      }

      if (branches[branch] !== 'master') {
        $scope.runnerConfigs[branch][branches[branch].runner.id] = branches[branch].runner.config;
      }
      for (var runner in $scope.runners) {
        if (branches[branch] !== 'master' && runner === branches[branch].runner.id) continue;
        $scope.runnerConfigs[branch][runner] = {};
      }
    }
    function initPlugins() {
      var branches = $scope.project.branches
      for (var branch in branches) {
        initBranch(branch);
        $scope.branches.push(branch);
      }
    }

    $scope.saveGeneral = function () {
      // TODO
      throw new Error("not implemented");
    };

    $scope.generateKeyPair = function () {
      // TODO implement
      throw new Error("not implemented");
    };

    initPlugins();
    
    $scope.gravatar = function (email) {
      if (!email) return '';
      var hash = md5(email.toLowerCase());
      return 'https://secure.gravatar.com/avatar/' + hash + '?d=identicon';
    }
    $scope.error = function (text) {
      $scope.message = {
        text: $sce.trustAsHtml(text),
        type: 'error',
        showing: true
      };
    };
    $scope.info = function (text) {
      $scope.message = {
        text: $sce.trustAsHtml(text),
        type: 'info',
        showing: true
      };
    };
    var waitTime = null;
    $scope.success = function (text, sticky) {
      if (waitTime) {
        clearTimeout(waitTime);
        waitTime = null;
      }
      if (clearTime) {
        clearTimeout(clearTime);
        clearTime = null;
      }
      $scope.message = {
        text: $sce.trustAsHtml('<strong>Done.</strong> ' + text),
        type: 'success',
        showing: true
      };
      if (!sticky) {
        waitTime = setTimeout(function () {
          $scope.clearMessage();
          $scope.$digest();
        }, 5000);
      }
    };
    var clearTime = null;
    $scope.clearMessage = function () {
      if (clearTime) {
        clearTimeout(clearTime);
      }
      if ($scope.message) {
        $scope.message.showing = false;
      }
      clearTime = setTimeout(function () {
        clearTime = null;
        $scope.message = null;
        $scope.$digest();
      }, 1000);
    };

    $scope.runnerConfig = function (branch, data, next) {
      if (!next) {
        next = data;
        data = branch;
        branch = $scope.branch;
      }
      var name = $scope.project.branches[branch].runner.id;
      if (arguments.length < 2) {
        return $scope.project.branches[branch].runner.config;
      }
      $.ajax({
        url: 'master/runner',
        type: 'PUT',
        data: data,
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
        url: 'master/provider',
        type: 'PUT',
        data: data,
        success: function(data, ts, xhr) {
          $scope.success("Provider config saved.");
          next(null, data.config);
          $scope.$root.$digest();
        },
        error: function(xhr, ts, e) {
          if (xhr && xhr.responseText) {
            var data = $.parseJSON(xhr.responseText);
            $scope.error("Error saving provider config: " + data.errors[0]);
          } else {
            $scope.error("Error saving provider config: " + e);
          }
          next();
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
      var branchobj = $scope.project.branches[branch]
      if (!branchobj || 'string' === typeof branchobj) {
        return
      }
      var plugin = $scope.configs[branch][name]
      if (arguments.length < 3) {
        return plugin.config;
      }
      if (plugin === null) {
        console.error("pluginConfig called for a plugin that's not configured. " + name);
        throw new Error('Plugin not configured: ' + name);
      }
      $.ajax({
        url: '/' + $scope.project.name + '/config/' + branch + "/" + name,
        type: "PUT",
        data: data,
        success: function(data, ts, xhr) {
          $scope.success("Config for " + name + " on branch " + branch + " saved.");
          $scope.configs[branch][name].config = data;
          next(null, data);
          $scope.$root.$digest();
        },
        error: function(xhr, ts, e) {
          if (xhr && xhr.responseText) {
            var data = $.parseJSON(xhr.responseText);
            $scope.error("Error saving " + name + " config on branch " + branch + ": " + data.errors[0]);
          } else {
            $scope.error("Error saving " + name + " config on branch " + branch + ": " + e);
          }
          next();
          $scope.$root.$digest();
        }
      });
    };

    $scope.post = post;
  }]);

})();
