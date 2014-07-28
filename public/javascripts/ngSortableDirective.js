(function () {
  "use strict";

  window.ngSortableDirective = ['$parse', function ($parse) {
    return {
      compile: function ($element, attr) {
        var opts = {}
        var onUpdate = attr['ngSortable'];
        var getter = $parse(attr['ngModel']);
        return function (scope, element) {
          var bind = function (fn) {
            return function (event) {
              var model = getter(scope);
              var list = _.cloneDeep(model);
              var $el = $(event.target);
              var newIndex = $el.index();
              var id = $($el).data('ng-sortable-id');
              var oldIndex = null;
              var target = _.find(list, function (b, i) {
                oldIndex = i;
                return b._id === id;
              });
              if (target) {
                list.splice(oldIndex, 1);
                list.splice(newIndex, 0, target);
                scope.$apply(function() {
                  scope[fn](list);
                });
              } else {
                // this requirement can go away if we set IDs ourself during compiletime
                // but generally you'll have an ID to give
                throw new Error("Could not locate target element. Did you forget to set attribute data-ng-sortable-id on your repeated HTML elements?")
              }
            }
          };
          if (onUpdate) opts.onUpdate = bind(onUpdate);
          scope.sortable = new Sortable(element.get(0), opts);
        };
      }
    }
  }];

}());
