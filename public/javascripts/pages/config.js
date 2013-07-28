
function notify(text, type) {
  if (!text) return $('#notify').hide();
  type = type || 'info';
  $('#notify .message').html(text);
  $('#notify')
    .removeClass()
    .addClass('span8 alert alert-' + type)
    .show();
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
  $scope.gravatar = function (email) {
    var hash = md5(email.toLowerCase());
    return 'https://secure.gravatar.com/avatar/' + hash + '?d=identicon';
  }
  $scope.message = notify;
  $scope.error = function (text) {
    notify(text, 'error');
  };
  $scope.info = function (text) {
    notify(text, 'info');
  };
  $scope.success = function (text) {
    notify('<strong>Done.</strong> ' + text, 'success');
  };
  $scope.hideMessage = function () {
    $('#notify').hide();
  };
}]);

