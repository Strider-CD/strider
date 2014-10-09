'use strict';

function ProviderController($scope) {
  $scope.config = $scope.providerConfig();
  $scope.saving = false;
  $scope.save = function () {
    $scope.saving = true;
    $scope.providerConfig($scope.config, function () {
      $scope.saving = false;
    });
  };
}

module.exports = ProviderController;
