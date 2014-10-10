'use strict';

function JobController($scope, $element) {
  var name = $element.attr('id').split('-').slice(1).join('-');
  $scope.$watch('userConfigs["' + name + '"]', function (value) {
    $scope.userConfig = value;
  });
  $scope.$watch('configs[branch.name]["' + name + '"].config', function (value) {
    $scope.config = value;
  });
  $scope.saving = false;
  $scope.save = function () {
    $scope.saving = true;
    $scope.pluginConfig(name, $scope.config, function () {
      $scope.saving = false;
    });
  };
}

module.exports = JobController;
