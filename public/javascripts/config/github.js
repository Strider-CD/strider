
app.controller('GithubCtrl', ['$scope', function ($scope) {
  $scope.removeWebhooks = function () {
    bootbox.confirm('Really remove the github webhooks? If you only want to temporarily disable build on commit, go to the "activate" tab', 'Just kidding', 'Yes, really', function (result) {
      if (!result) return
      // XXXX remove it.
      removeWebhooks($scope.repo_url);
    });
  };
}]);

