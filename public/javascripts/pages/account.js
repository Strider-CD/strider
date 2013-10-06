
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

  var app = angular.module('Account', ['Alerts'], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  });

  app.controller('AccountController', ['$scope', '$sce', function ($scope, $sce) {
    $scope.user = window.user || {};
    $scope.providers = window.providers || {};
    $scope.accounts = setupAccounts($scope.user);

    $scope.deleteAccount = function (account) {
      $scope.error('Delete account not implemented', true);
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

})(angular);
