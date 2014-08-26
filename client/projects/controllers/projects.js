'use strict';

var $ = require('jquery');

module.exports = function ($scope) {
  setTimeout(function () {
    if (global.location.hash === '#manual') $('a[href="#manual-setup"]').tab('show');
  }, 200);
  $scope.accounts = global.accounts;
  $scope.repos = global.repos;
  $scope.providers = global.providers;
  $scope.projectsPage = true;
  $scope.toggleAdd = function (repo) {
    repo.adding = 'pick-type';
  };
  $scope.toggleAddCancel = function (repo) {
    repo.adding = false;
  };
  $scope.toggleRemove = function (repo) {
    repo.really_remove = true;
  };
  $scope.toggleRemoveCancel = function (repo) {
    repo.really_remove = false;
  };
  $scope.removeProject = function (account, repo, group) {
    repo.really_remove = 'removing';
    repo.adding = false;

    $.ajax('/' + repo.name + '/', {
      type: 'DELETE',
      success: function (data, ts, xhr) {
        repo.project = null;
        repo.really_remove = false;
        group.configured--;
        $scope.$digest();
      },
      error: function (xhr, ts, e) {
        repo.really_remove = false;
        if (xhr && xhr.responseText) {
          $scope.error("Error creating project for repo " + repo.name + ": " + xhr.responseText, true);
        } else {
          $scope.error("Error creating project for repo " + repo.name + ": " + e, true);
        }
      }
    });
  };
  $scope.setupProject = function (account, repo, type, group) {
    $.ajax('/' + repo.name + '/', {
      type: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({
        display_name: repo.display_name || repo.name,
        display_url: repo.display_url,
        project_type: type,
        provider: {
          id: account.provider,
          account: account.id,
          repo_id: repo.id,
          config: repo.config
        }
      }),
      success: function (data, ts, xhr) {
        repo.project = data.project;
        repo.adding = 'done';
        group.configured++;
        $scope.$digest();
      },
      error: function (xhr, ts, e) {
        if (xhr && xhr.responseText) {
          $scope.error("Error creating project for repo " + repo.name + ": " + xhr.responseText, true);
        } else {
          $scope.error("Error creating project for repo " + repo.name + ": " + e, true);
        }
      }
    });
  };
  $scope.startTest = function (repo) {
    $.ajax('/' + repo.project.name + '/start', {
      type: 'POST',
      success: function (data, ts, xhr) {
        repo.adding = false;
        $scope.success('Test started for ' + repo.project.name + '. <a href="/' + repo.project.name + '/">Click to watch it run</a>', true, true);
      },
      error: function (xhr, ts, e) {
        if (xhr && xhr.responseText) {
          $scope.error("Error starting test for project " + repo.project.name + ": " + xhr.responseText, true);
        } else {
          $scope.error("Error starting test for project " + repo.project.name + ": " + e, true);
        }
      }
    });
  };
};
