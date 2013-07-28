
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
  $scope.repo = JSON.parse($element.attr('data-repo-config') || '{}');
  $scope.panelData = JSON.parse($element.attr('data-panel-data') || '{}');
}]);

