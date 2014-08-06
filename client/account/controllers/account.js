'use strict';

var $ = require('jquery');
var user = global.user || {};
var providers = global.providers || {};

function AccountController($scope, $sce) {
  $scope.user = user;
  $scope.providers = providers;
  $scope.accounts = setupAccounts($scope.user);

  $scope.deleteAccount = function (account) {
    if (account.unsaved) {
      var idx = $scope.accounts[account.provider].indexOf(account);
      $scope.accounts[account.provider].splice(idx, 1);
      idx = $scope.user.accounts.indexOf(account);
      $scope.user.accounts.splice(idx, 1);
      $scope.success('Account removed');
      return;
    }
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
    var id = 0
      , aid;
    if (!$scope.accounts[provider]) {
      $scope.accounts[provider] = [];
    }
    for (var i=0; i<$scope.accounts[provider].length; i++) {
      aid = parseInt($scope.accounts[provider][i].id, 10);
      if (aid >= id) {
        id = aid + 1;
      }
    }
    var acct = {
      id: id,
      provider: provider,
      title: provider + ' ' + id,
      last_updated: new Date(),
      config: {},
      cache: [],
      unsaved: true
    };
    $scope.accounts[provider].push(acct);
    $scope.user.accounts.push(acct);
  };

  $scope.saveAccount = function (provider, account, next) {
    $.ajax('/api/account/' + provider + '/' + account.id, {
      type: 'PUT',
      data: JSON.stringify(account),
      contentType: 'application/json',
      error: function (xhr, ts, e) {
        $scope.error('Unable to save account', true);
      },
      success: function(data, ts, xhr) {
        delete account.unsaved;
        next()
        $scope.success('Account saved', true);
      }
    });
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
}

module.exports = AccountController;

function setupAccounts(user) {
  var accounts = {};

  if (!user.accounts || !user.accounts.length) {
    return accounts;
  }

  for (var i=0; i<user.accounts.length; i++) {
    if (!accounts[user.accounts[i].provider]) {
      accounts[user.accounts[i].provider] = [];
    }

    accounts[user.accounts[i].provider].push(user.accounts[i]);
  }

  return accounts;
}
