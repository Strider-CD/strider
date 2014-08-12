'use strict';

module.exports = function () {
  return {
    restrict: 'A',
    scope: {},
    link: function (scope, element, attrs) {
      scope.$parent.$watch('job.plugin_data["' + attrs.pluginStatus + '"]', function (value) {
        scope.data = value;
      });
      scope.$parent.$watch('showStatus[job.ref.branch]["' + attrs.pluginStatus + '"]', function (value) {
        scope.show = value;
      });
      scope.$parent.$watch('job', function (value) {
        scope.job = value;
      });
    }
  };
};
