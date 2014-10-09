'use strict';

module.exports = function () {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      var name = attrs.rawHtml;
      scope.$watch(name, function (value) {
        element[0].innerHTML = value || '';
      });
    }
  };
};
