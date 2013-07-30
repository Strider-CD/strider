

app.controller('CollaboratorsCtrl', ['$scope', function ($scope) {
  function remove(ar, item) {
    ar.splice(ar.indexOf(item), 1);
  }
  $scope.new_email = '';
  $scope.collaborators = $scope.panelData.collaborators;
  $scope.notOwner = function (item) {
    return !item.owner;
  };
  $scope.remove = function (item) {
    item.loading = true;
    $scope.clearMessage();
    $.ajax({
      url: "/api/collaborators",
      type: "DELETE",
      data: {email: item.email, url: $scope.repo.url},
      success: function(data, ts, xhr) {
        $scope.success(item.email + " is no longer a collaborator on this project.");
        remove($scope.collaborators, item);
        $scope.$root.$digest();
      },
      error: function(xhr, ts, e) {
        if (xhr && xhr.responseText) {
          var data = $.parseJSON(xhr.responseText);
          $scope.error("Error deleting collaborator: " + data.errors[0]);
        } else {
          $scope.error("Error deleting collaborator: " + e);
        }
        item.loading = false;
        $scope.$root.$digest();
      }
    });
  };
  $scope.add = function () {
    var data = {email: $scope.new_email, url: $scope.repo.url, access_level: 1}
      , display = $.extend({loading: true, gravatar: $scope.gravatar(data.email)}, data);
    /* no specific access level support yet
    if (access_level) {
      data.access_level = access_level;
    }
    */

    $scope.collaborators.push(display);
    $.ajax({
      url: "/api/collaborators",
      type: "POST",
      data: data,
      dataType: "json",
      success: function(data, ts, xhr) {
        $scope.success(data.message);
        display.loading = false;
        if (!data.created) {
          remove($scope.collaborators, display);
        }
        $scope.$root.$digest();
      },
      error: function(xhr, ts, e) {
        if (xhr && xhr.responseText) {
          var data = $.parseJSON(xhr.responseText);
          $scope.error("Error adding collaborator: " + data.errors[0]);
        } else {
          $scope.error("Error adding collaborator: " + e);
        }
        remove($scope.collaborators, display);
        $scope.$root.$digest();
      }
    });
  };
  $scope.noCollaborators = function () {
    for (var i=0; i<$scope.collaborators.length; i++) {
      if (!$scope.collaborators[i].owner) return false;
    }
    return true;
  };
}]);
