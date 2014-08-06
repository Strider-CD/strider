'use strict';

function JobController($scope, $element, $attrs) {
  var name = $attrs.id.split('-')[1];
  $scope.$watch('user.jobplugins["' + name + '"]', function (value) {
    $scope.config = value;
  });
}

module.exports = JobController;
