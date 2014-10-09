'use strict';

var $ = require('jquery');

module.exports = function ($scope, $attrs) {
  var provider = $attrs.id.split('-')[1];
  $scope.config = {};
  $scope.projects = global.manualProjects[provider] || [];
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
          name: $scope.display_name.replace(/ /g, '-').toLowerCase(),
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
};

function validName(name) {
  return !!name.match(/[\w-]+\/[\w-]+/);
}
