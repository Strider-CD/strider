'use strict';

function RunnerController($scope, $element) {
  var name = $element.attr('id').split('-').slice(1).join('-');
  $scope.saving = false;
  $scope.$watch('runnerConfigs[branch.name]["' + name + '"]', function (value) {
    // console.debug('Runner config', name, value, $scope.runnerConfigs);
    $scope.config = value;
  });
  $scope.save = function () {
    $scope.saving = true;
    $scope.runnerConfig($scope.config, function () {
      $scope.saving = false;
    });
  };
}

module.exports = RunnerController;
