
;(function (angular) {
  var app = angular.module('Projects', ['Alerts', 'moment'], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  });

  app.controller('ProjectsController', ['$scope', function ($scope) {
    $scope.accounts = window.accounts;
    $scope.repos = window.repos;
    $scope.providers = window.providers;
    $scope.removeProject = function (account, repo) {
      setTimeout(function () {
      $scope.error('Remove project not yet implemented', true);
      }, 0);
    };
    $scope.setupProject = function (account, repo, type) {
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
  }]);
})(angular);
