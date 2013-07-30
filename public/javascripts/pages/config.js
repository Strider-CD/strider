
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
    if (!email) return '';
    var hash = md5(email.toLowerCase());
    return 'https://secure.gravatar.com/avatar/' + hash + '?d=identicon';
  }
  $scope.error = function (text) {
    $scope.message = {
      text: text,
      type: 'error',
      showing: true
    };
  };
  $scope.info = function (text) {
    $scope.message = {
      text: text,
      type: 'info',
      showing: true
    };
  };
  var waitTime = null;
  $scope.success = function (text, sticky) {
    if (waitTime) {
      clearTimeout(waitTime);
      waitTime = null;
    }
    if (clearTime) {
      clearTimeout(clearTime);
      clearTime = null;
    }
    $scope.message = {
      text: '<strong>Done.</strong> ' + text,
      type: 'success',
      showing: true
    };
    if (!sticky) {
      waitTime = setTimeout(function () {
        $scope.clearMessage();
        $scope.$digest();
      }, 5000);
    }
  };
  var clearTime = null;
  $scope.clearMessage = function () {
    if (clearTime) {
      clearTimeout(clearTime);
    }
    $scope.message.showing = false;
    clearTime = setTimeout(function () {
      clearTime = null;
      $scope.message = null;
      $scope.$digest();
    }, 1000);
  };
}]);

