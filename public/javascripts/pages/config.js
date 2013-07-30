
window.app = angular.module('config', [], function ($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
});

app.controller('Config', ['$scope', '$element', function ($scope, $element, $attributes) {
  // this is the parent controller.
  $scope.message = null;
  $scope.repo = JSON.parse($element.attr('data-repo-config') || '{}');
  $scope.panelData = JSON.parse($element.attr('data-panel-data') || '{}');
  $scope.gravatar = function (email) {
    var hash = md5(email.toLowerCase());
    return 'https://secure.gravatar.com/avatar/' + hash + '?d=identicon';
  }
  $scope.error = function (text) {
    $scope.message = {
      text: text,
      type: 'error'
    };
  };
  $scope.info = function (text) {
    $scope.message = {
      text: text,
      type: 'info'
    };
  };
  $scope.success = function (text) {
    $scope.message = {
      text: '<strong>Done.</strong> ' + text,
      type: 'success'
    };
  };
  $scope.clearMessage = function () {
    $scope.message = null;
  };
}]);

