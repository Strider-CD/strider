
;(function (angular) {
  var app = angular.module('Projects', ['Alerts'], function ($interpolateProvider) {
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
    $scope.setupProject = function (account, repo) {
      setTimeout(function () {
      $scope.error('Setup project not yet implemented', true);
      }, 0);
    };
  }]);
})(angular);
