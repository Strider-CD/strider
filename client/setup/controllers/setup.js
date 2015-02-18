'use strict';

module.exports = function ($scope, $http) {
  $scope.config = {
    general: {},
    db: {},
    email: {},
    admin: {}
  };

  $scope.finishedWizard = function () {
    console.log('finished', $scope.config);
    $http.post('/setup', $scope.config)
      .success(function (data) {
        global.location.reload();
      })
      .error(function (error) {
        console.error('Setup error: ', error);
      });
  };
};
