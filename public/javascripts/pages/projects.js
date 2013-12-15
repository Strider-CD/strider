
;(function (angular) {
  var app = angular.module('Projects', ['Alerts', 'moment', 'ui.bootstrap.buttons'], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  });

  function validName(name) {
    return !!name.match(/[\w-]+\/[\w-]+/);
  }

  app.controller('ManualController', ['$scope', '$attrs', function ($scope, $attrs) {
    var provider = $attrs.id.split('-')[1];
    $scope.config = {};
    $scope.projects = window.manualProjects[provider] || [];
    $scope.remove = function (project) {
      project.really_remove = 'removing';
      $.ajax('/' + project.name + '/', {
        type: 'DELETE',
        success: function () {
          $scope.projects.splice($scope.projects.indexOf(project), 1);
          $scope.success('Project removed', true);
        },
        error: function () {
          $scope.error('Failed to remove project', true);
        }
      })
    };
    $scope.create = function () {
      var name = $scope.display_name.toLowerCase();
      if (!validName(name)) return;
      $.ajax('/' + name + '/', {
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify({
          display_name: $scope.display_name,
          display_url: $scope.display_url,
          public: $scope.public,
          provider: {
            id: provider,
            config: $scope.config
          }
        }),
        success: function () {
          $scope.projects.push({
            display_name: $scope.display_name,
            display_url: $scope.display_url,
            provider: {
              id: provider,
              config: $scope.config
            }
          });
          $scope.config = {};
          $scope.display_name = '';
          $scope.display_url = '';
          $scope.success('Created project!', true);
        },
        error: function () {
          $scope.error('failed to create project', true);
        }
      });
    }
  }]);

  app.controller('ProjectsController', ['$scope', function ($scope) {
    setTimeout(function () {
      if (location.hash === '#manual') $('a[href="#manual-setup"]').tab('show');
    }, 200);
    $scope.accounts = window.accounts;
    $scope.repos = window.repos;
    $scope.providers = window.providers;
    $scope.projectsPage = true;
    $scope.removeProject = function (account, repo, group) {
      repo.really_remove = 'removing';
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
  }]);
})(angular);
