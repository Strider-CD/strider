
app.controller('WebhooksCtrl', ['$scope', function ($scope) {
  function remove(ar, item) {
    ar.splice(ar.indexOf(item), 1);
  }
  $scope.hooks = $scope.panelData.webhooks;

  $scope.remove = function (hook) {
    hook.loading = true;
    $.ajax({
      url: "/api/webhooks",
      type: "DELETE",
      data: {webhook_id: hook._id, url: $scope.repo.url},
      success: function(data, ts, xhr) {
        remove($scope.hooks, hook);
        $scope.success("Webhook removed.");
        $scope.$root.$digest();
      },
      error: function(xhr, ts, e) {
        hook.loading = false;
        if (xhr && xhr.responseText) {
          var data = $.parseJSON(xhr.responseText);
          $scope.error("Error deleting webhook: " + data.errors[0]);
        } else {
          $scope.error("Error deleting webhook: " + e);
        }
        $scope.$root.$digest();
      }
    });

  };

  $scope.add = function () {
    var data = {
      url: $scope.repo.url,
      target_url: $scope.new_url,
      secret: $scope.new_secret,
      title: $scope.new_title
    };
    var display = $.extend({loading: true}, data);
    display.url = data.target_url;
    $scope.hooks.push(display);
    // we don't do this yet
    /**
    if (type) {
      data.type = type;
    }
    **/
    $.ajax({
      url: "/api/webhooks",
      type: "POST",
      data: data,
      dataType: "json",
      success: function(data, ts, xhr) {
        $scope.success("Webhook added.");
        display.loading = false;
        display._id = data.id;
        $scope.new_url = $scope.new_title = $scope.new_secret = '';
        $scope.$root.$digest();
      },
      error: function(xhr, ts, e) {
        if (xhr && xhr.responseText) {
          var data = $.parseJSON(xhr.responseText);
          $scope.error("Error adding webhook: " + data.errors[0]);
        } else {
          $scope.error("Error adding webhook: " + e);
        }
        remove($scope.hooks, display);
        $scope.$root.$digest();
      }
    });
  };
}]);
