
function notify(text, type) {
  if (!text) return $('#notify').hide();
  type = type || 'info';
  $('#notify')
    .removeClass()
    .addClass('alert alert-' + type)
    .html(text);
}

function removeWebHooks(repo_url, next) {
  notify('Deleting webhooks...');
  $.ajax('/api/github/webhooks/unset', {
    data: {url: repo_url},
    dataType: 'json',
    error: function(xhr, ts, e) {
      notify("Error removing webhooks.", 'error');
    },
    success: function(data, ts, xhr) {
      notify("Webhooks removed.", 'success');
      next && next();
    },
    type: 'POST',
  });
}

window.app = angular.module('config', [], function ($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
});

app.controller('Config', ['$scope', '$element', function ($scope, $element, $attributes) {
  // this is the parent controller.
  $scope.repo_config = JSON.parse($element.get('data-repo-config') || '{}');
  $scope.repo_url = $scope.repo_config.repo_url;
  $scope.panelData = window.plugin_data;
}]);

app.controller('CollaboratorsCtrl', ['$scope', function ($scope) {
  $scope.collaborators = $scope.panelData.collaborators;
}]);

app.controller('GithubCtrl', ['$scope', function ($scope) {
  $scope.removeWebhooks = function () {
    bootbox.confirm('Really remove the github webhooks? If you only want to temporarily disable build on commit, go to the "activate" tab', 'Just kidding', 'Yes, really', function (result) {
      if (!result) return
      // XXXX remove it.
      removeWebhooks($scope.repo_url);
    });
  };
}]);

app.controller('HerokuCtrl', ['$scope', function ($scope) {
  $scope.heroku_apps = null;
  $scope.existing_app = null;
}]);

app.controller('WebhooksCtrl', ['$scope', function ($scope) {
  $scope.hooks = [];
}]);

app.controller('DeactivateCtrl', ['$scope', function ($scope) {
  $scope.active = true;
}]);
