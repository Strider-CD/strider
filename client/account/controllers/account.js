'use strict';

var $ = require('jquery');
var user = global.user || {};
var providers = global.providers || {};

function AccountController($scope, $window) {
  $scope.user = user;
  $scope.providers = providers;
  $scope.accounts = setupAccounts($scope.user);

  // We can't use $location here, because $locationProvider is set to use HTML5 mode and the hrefs in Strider
  // are _all over the place_ and no base href is set anywhere. That's why $location refuses to work properly.
  var locationHash = $window.location.hash;
  if (locationHash) {
    $(`a[href="${locationHash}"]`).tab('show');
  }

  $scope.deleteAccount = function (account) {
    if (account.unsaved) {
      var idx = $scope.accounts[account.provider].indexOf(account);
      $scope.accounts[account.provider].splice(idx, 1);
      idx = $scope.user.accounts.indexOf(account);
      $scope.user.accounts.splice(idx, 1);
      $scope.success('Account removed');
      return;
    }
    $.ajax(`/api/account/${account.provider}/${account.id}`, {
      type: 'DELETE',
      success: function () {
        var idx = $scope.accounts[account.provider].indexOf(account);
        $scope.accounts[account.provider].splice(idx, 1);
        idx = $scope.user.accounts.indexOf(account);
        $scope.user.accounts.splice(idx, 1);
        $scope.success('Account removed', true);
      },
      error: function (err) {
        $scope.error(err && err.responseText ? err.responseText : 'Failed to remove account', true);
      }
    });
  };

  $scope.addAccount = function (provider) {
    var id = 0;
    if (!$scope.accounts[provider]) {
      $scope.accounts[provider] = [];
    }
    for (var i = 0; i < $scope.accounts[provider].length; i++) {
      var aid = parseInt($scope.accounts[provider][i].id, 10);
      if (aid >= id) {
        id = aid + 1;
      }
    }
    var acct = {
      id: id,
      provider: provider,
      title: `${provider} ${id}`,
      last_updated: new Date(),
      config: {},
      cache: [],
      unsaved: true
    };
    $scope.accounts[provider].push(acct);
    $scope.user.accounts.push(acct);
  };

  $scope.saveAccount = function (provider, account, next) {
    $.ajax(`/api/account/${provider}/${account.id}`, {
      type: 'PUT',
      data: JSON.stringify(account),
      contentType: 'application/json',
      error: function () {
        $scope.error('Unable to save account', true);
      },
      success: function () {
        delete account.unsaved;
        next();
        $scope.success('Account saved', true);
      }
    });
  };

  $scope.changePassword = function () {
    $.ajax('/api/account/password', {
      data: {password: $scope.password},
      dataType: 'json',
      error: function () {
        $scope.error('Unable to change password', true);
      },
      success: function () {
        $scope.password = '';
        $scope.confirm_password = '';
        $scope.success('Password changed', true);
      },
      type: 'POST'
    });
  };

  $scope.changeEmail = function () {
    $.ajax('/api/account/email', {
      data: {email: $scope.user.email},
      dataType: 'json',
      error: function (xhr) {
        var resp = $.parseJSON(xhr.responseText);
        $scope.error(`Failed to change email: ${resp.errors[0].message}`, true);
      },
      success: function () {
        $scope.success('Email successfully changed', true);
      },
      type: 'POST'
    });
  };

  $scope.changeJobsQuantityOnPage = function () {
    $.ajax('/api/account/jobsQuantityOnPage', {
      type: 'POST',
      data: {quantity: $scope.user.jobsQuantityOnPage},
      dataType: 'json',
      error: function (xhr) {
        var resp = $.parseJSON(xhr.responseText);
        $scope.error(`Failed to change jobs quantity on page: ${resp.errors[0].message}`, true);
      },
      success: function () {
        $scope.success('Jobs quantity on page successfully changed', true);
      },
    });
  };
}

module.exports = AccountController;

function setupAccounts(user) {
  var accounts = {};

  if (!user.accounts || !user.accounts.length) {
    return accounts;
  }

  for (var i = 0; i < user.accounts.length; i++) {
    if (!accounts[user.accounts[i].provider]) {
      accounts[user.accounts[i].provider] = [];
    }

    accounts[user.accounts[i].provider].push(user.accounts[i]);
  }

  return accounts;
}
