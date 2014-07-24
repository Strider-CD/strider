
app.controller('DeactivateCtrl', ['$scope', function ($scope) {
  var message = 'This will remove all configuration and history for this project. You can always re-add it on the /projects page';
  $scope.active = $scope.panelData.deactivate;
  $scope.loading = false;
  $scope.toggleActive = function () {
    $scope.active = !$scope.active;
    var data = {url: $scope.repo.url, active: $scope.active};
    $.ajax({
      url: "/api/repo",
      type: "POST",
      data: data,
      dataType: "json",
      success: function(data, ts, xhr) {
        $scope.success($scope.active ? 'Activated' : 'Deactivated');
        $scope.$root.$digest();
      },
      error: function(xhr, ts, e) {
        if (xhr && xhr.responseText) {
          var data = $.parseJSON(xhr.responseText);
          $scope.error("Error settings active state: " + data.errors[0]);
        } else {
          $scope.error("Error settings active state: " + e);
        }
        $scope.active = !$scope.active;
        $scope.$root.$digest();
      }
    });
  };

  $scope.confirmDeleteProject = function () {
    bootbox.confirm('<h2>Really Delete Project Data?</h2><p>' + message + '</p>', 'Just kidding', 'Yes, really', function (really) {
      if (!really) return;
      $.ajax({
        url: "/api/repo",
        type: "DELETE",
        data: {url: $scope.repo.url},
        success: function(data, ts, xhr) {
          $scope.success("Project removed.");
          $scope.$root.$digest();
          setTimeout(function () {
            window.location = '/';
          }, 500);
        },
        error: function(xhr, ts, e) {
          if (xhr && xhr.responseText) {
            var data = $.parseJSON(xhr.responseText);
            $scope.error("Error deleting project: " + data.errors[0]);
          } else {
            $scope.error("Error deleting project: " + e);
          }
          $scope.$root.$digest();
        }
      });
    });
  };
}]);
