'use strict';

module.exports = function ($scope, $sce) {
  $scope.message = null;

  $scope.error = function (text, digest) {
    $scope.message = {
      text: $sce.trustAsHtml(text),
      type: 'error',
      showing: true
    };

    if (digest) {
      $scope.$root.$digest();
    }
  };

  $scope.info = function (text, digest) {
    $scope.message = {
      text: $sce.trustAsHtml(text),
      type: 'info',
      showing: true
    };

    if (digest) {
      $scope.$root.$digest();
    }
  };

  var waitTime = null;
  $scope.success = function (text, digest, sticky) {
    if (waitTime) {
      clearTimeout(waitTime);
      waitTime = null;
    }

    if (clearTime) {
      clearTimeout(clearTime);
      clearTime = null;
    }

    $scope.message = {
      text: $sce.trustAsHtml('<strong>Done.</strong> ' + text),
      type: 'success',
      showing: true
    };

    if (!sticky) {
      waitTime = setTimeout(function () {
        $scope.clearMessage();
        $scope.$digest();
      }, 5000);
    }

    if (digest) {
      $scope.$root.$digest();
    }
  };

  var clearTime = null;
  $scope.clearMessage = function () {
    if (clearTime) {
      clearTimeout(clearTime);
    }

    if ($scope.message) {
      $scope.message.showing = false;
    }

    clearTime = setTimeout(function () {
      clearTime = null;
      $scope.message = null;
      $scope.$digest();
    }, 1000);
  };
};
