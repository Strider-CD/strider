function removeWebhooks(repo_url, next) {
}


app.controller('GithubCtrl', ['$scope', function ($scope) {
  $scope.removeWebhooks = function () {
    bootbox.confirm('<h2>Really remove the github webhooks?</h2> <p>If you only want to temporarily disable build on commit, go to the "Deactivate" tab', 'Just kidding', 'Yes, really', function (result) {
      if (!result) return
      // XXXX remove it.
      $scope.info('Deleting webhooks...');
      $.ajax('/api/github/webhooks/unset', {
        data: {url: $scope.repo.url},
        dataType: 'json',
        error: function(xhr, ts, e) {
          $scope.error("Error removing webhooks.");
          $scope.$root.$digest();
        },
        success: function(data, ts, xhr) {
          $scope.success("Webhooks removed.");
          $scope.$root.$digest();
        },
        type: 'POST',
      });
    });
  };
}]);

