(function () {
  "use strict";

  window.ngSortableDirective = ['$parse', function ($parse) {
    return {
      compile: function ($element, attr) {
        var opts = {}
        var onUpdate = attr['ngSortable'];
        var model = attr['ngModel'];
        return function (scope, element) {
          var bind = function (fn) {
            return function (event) {
              var list = _.clone(scope[model]);
              var $el = $(event.target);
              var newIndex = $el.index();
              var id = $($el).data('ng-sortable-id');
              var oldIndex = null;
              var target = _.find(list, function (b, i) {
                oldIndex = i;
                return b._id === id;
              });
              list.splice(oldIndex, 1);
              list.splice(newIndex, 0, target);
              scope.$apply(function() {
                scope[fn](list);
              });
            }
          };
          if (onUpdate) opts.onUpdate = bind(onUpdate);
          scope.sortable = new Sortable(element.get(0), opts);
        };
      }
    }
  }];

}());
