
;(function (angular) {
  var app = angular.module('Projects', ['Alerts'], function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
  });

  app.controller('ProjectsController', ['$scope', function ($scope) {
    $scope.accounts = window.accounts;
    $scope.repos = window.repos;
    $scope.providers = window.providers;
  }]);
})(angular);
