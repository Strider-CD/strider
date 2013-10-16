
;(function (angular) {

  function setupAccounts(user) {
    var accounts = {};
    if (!user.accounts || !user.accounts.length) return accounts;
    for (var i=0; i<user.accounts.length; i++) {
      if (!accounts[user.accounts[i].provider]) {
        accounts[user.accounts[i].provider] = [];
      }
      accounts[user.accounts[i].provider].push(user.accounts[i]);
    }
    return accounts;
  }

  var app = window.app = angular.module('Account', ['Alerts'], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  });

  app.controller('AccountController', ['$scope', '$sce', function ($scope, $sce) {
    $scope.user = window.user || {};
    $scope.providers = window.providers || {};
    $scope.accounts = setupAccounts($scope.user);

    $scope.deleteAccount = function (account) {
      $.ajax('/api/account/' + account.provider + '/' + account.id, {
        type: 'DELETE',
        success: function () {
          var idx = $scope.accounts[account.provider].indexOf(account);
          $scope.accounts[account.provider].splice(idx, 1);
          idx = $scope.user.accounts.indexOf(account);
          $scope.user.accounts.splice(idx, 1);
          $scope.success('Account removed', true);
        },
        error: function () {
          $scope.error('Failed to remove account', true);
        }
      });
    };

    $scope.addAccount = function (provider) {
      $scope.error('Add account not implemented', true);
    };

    $scope.changePassword = function () {
      $.ajax("/api/account/password", {
        data: {password: $scope.password},
        dataType: "json",
        error: function(xhr, ts, e) {
          $scope.error('Unable to change password', true);
        },
        success: function(data, ts, xhr) {
          $scope.password = '';
          $scope.confirm_password = '';
          $scope.success('Password changed', true);
        },
        type: "POST"
      });
    };

    $scope.changeEmail = function () {
      $.ajax("/api/account/email", {
        data: {email:$scope.user.email},
        dataType: "json",
        error: function(xhr, ts, e) {
          var resp = $.parseJSON(xhr.responseText);
          $scope.error('Failed to change email: ' + resp.errors[0].message, true);
        },
        success: function(data, ts, xhr) {
          $scope.success('Email successfully changed', true);
        },
        type: "POST"
      });
    };
  }]);

  app.controller('JobController', ['$scope', '$element', '$attrs', function ($scope, $element, $attrs) {
    var name = $attrs.id.split('-')[1];
    $scope.$watch('user.jobplugins["' + name + '"]', function (value) {
      $scope.config = value;
    });
  }]);

})(angular);
