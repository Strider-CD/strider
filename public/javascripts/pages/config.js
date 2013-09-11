
;(function () {

  window.app = angular.module('config', [], function ($interpolateProvider) {
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

  app.controller('Config', ['$scope', '$element', function ($scope, $element, $attributes) {
    // this is the parent controller.
    $scope.message = null;
    $scope.project = window.project || {};
    $scope.panelData = window.panelData || {};
    $scope.gravatar = function (email) {
      if (!email) return '';
      var hash = md5(email.toLowerCase());
      return 'https://secure.gravatar.com/avatar/' + hash + '?d=identicon';
    }
    $scope.error = function (text) {
      $scope.message = {
        text: text,
        type: 'error',
        showing: true
      };
    };
    $scope.info = function (text) {
      $scope.message = {
        text: text,
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
        text: '<strong>Done.</strong> ' + text,
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

    $scope.pluginConfig = function (name, data, next) {
      var plugin = null;
      for (var i=0; i<$scope.project.plugins.length; i++) {
        if ($scope.project.plugins[i].name === name) {
          plugin = $scope.project.plugins[i].config;
          break;
        }
      }
      if (plugin === null) {
        console.error("pluginConfig called for a plugin that's not configured. " + name);
        throw new Error('Plugin not configured: ' + name);
      }
      if (arguments.length === 1) {
        return plugin;
      }
      $.ajax({
        url: "api/config/" + name,
        type: "PUT",
        data: data,
        success: function(data, ts, xhr) {
          $scope.success("Config for " + name + " saved.");
          next(null, data);
          $scope.$root.$digest();
        },
        error: function(xhr, ts, e) {
          if (xhr && xhr.responseText) {
            var data = $.parseJSON(xhr.responseText);
            $scope.error("Error saving " + name + " config: " + data.errors[0]);
          } else {
            $scope.error("Error saving " + name + " config: " + e);
          }
          next();
          $scope.$root.$digest();
        }
      });
    };

    $scope.post = post;
  }]);

})();
