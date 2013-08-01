
app.controller('HerokuCtrl', ['$scope', function ($scope) {
  $scope.heroku = $scope.panelData.heroku;
  $scope.deploy_on_green = ($scope.repo.prod_deploy_target ?
                            $scope.repo.prod_deploy_target.deploy_on_green : true);
  $scope.status = $scope.heroku ? 'configured' : 'unconfigured';
  $scope.heroku_apps = ['@@new@@'];
  $scope.which_app = '@@new@@';
  $scope.apikey = '';

  $scope.goBack = function () {
    $scope.status = 'unconfigured';
  };

  // unconfigured
  $scope.checkApi = function () {
    $scope.loading = true;
    $.ajax("/api/heroku/account_integration", {
      data: {api_key: $scope.apikey},
      dataType: "json",
      error: function(xhr, ts, e) {
        $scope.error("Heroku API key invalid");
        $scope.loading = false;
        $scope.$root.$digest();
      },
      success: function(data, ts, xhr) {
        $scope.success("Heroku connected");
        $scope.apikey = data.api_key;
        $scope.heroku_apps = data.heroku_apps;
        $scope.which_app = '@@new@@';
        $scope.account_id = data.account_id;
        $scope.status = 'have-api';
        $scope.loading = false;
        $scope.$root.$digest();
      },
      type: "POST"
    });
  };

  $scope.herokuSelect = function () {
    var app_name = $scope.which_app;
    if (app_name === '@@new@@') {
      app_name = $scope.new_app_name;
    }
    $scope.loading = true;
    $.ajax("/api/heroku/delivery_integration", {
      data: {
        account_id: $scope.account_id,
        gh_repo_url: $scope.repo.url,
        app_name: app_name
      },
      dataType: "json",
      error: function(xhr, ts, e) {
        var data = $.parseJSON(xhr.responseText);
        $scope.error('Error: ' + data.errors[0]);
        $scope.loading = false;
        $scope.$root.$digest();
      },
      success: function(data, ts, xhr) {
        $scope.success("Heroku continuous deployment integration complete.");
        $scope.deploy_on_green = true;
        $scope.which_app = '@@new@@';
        $scope.new_app_name = '';
        $scope.heroku = {
          app: app_name
        };
        $scope.status = 'configured';
        $scope.loading = false;
        $scope.$root.$digest();
      },
      type: "POST",
    });
  };

  $scope.toggleDeploy = function () {
    $scope.deploy_on_green = !$scope.deploy_on_green;
    $scope.loading = true;
    $.ajax("/api/heroku/config", {
      data: {url: $scope.repo.url, deploy_on_green: $scope.deploy_on_green},
      error: function(xhr, ts, e) {
        $scope.error("Error toggling deploy on green.");
        $scope.deploy_on_green = !$scope.deploy_on_green;
        $scope.loading = false;
        $scope.$root.$digest();
      },
      success: function(data, ts, xhr) {
        $scope.success("Deploy on Green " + ($scope.deploy_on_green ? 'enabled' : 'disabled'));
        $scope.loading = false;
        $scope.$root.$digest();
      },
      type: "POST",
    });
  };

  $scope.removeHeroku = function () {
    $.ajax("/api/heroku/config", {
      data: {url: $scope.repo.url, unset_heroku:1},
      error: function(xhr, ts, e) {
        $scope.error("Error removing Heroku config.");
        $scope.loading = false;
        $scope.$root.$digest();
      },
      success: function(data, ts, xhr) {
        $scope.success('Removed Heroku config.');
        $scope.status = 'unconfigured';
        $scope.loading = false;
        $scope.$root.$digest();
      },
      type: "POST",
    });
  };
}]);

