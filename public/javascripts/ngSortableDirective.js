(function () {
  "use strict";

  window.ngSortableDirective = ['$parse', function ($parse) {
    return {
      compile: function ($element, attr) {
        var opts = {}
          , onAdd = null
          , onRemove = null
          , fauxAdd = null
          , groupName = attr['ngSortableGroupName']
          , onUpdate = attr['ngSortable'] || attr['ngSortableUpdate']
        ;
        if (groupName) {
          onAdd = attr['ngSortableAdded'];
          onRemove = attr['ngSortableRemoved'];
        }
        //var onUpdate = $parse(attr['updated']);
        //var fauxAdd = !attr['noFauxAdd'];

        return function (scope, element) {
          var bind = function (fn) {
            return function (event) {
              var list = _.cloneDeep($parse(attr['ngModel'])(scope));
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
                  $parse(fn)(scope)(list);
                });
              } else {
                // this requirement can go away if we set IDs ourself during compiletime
                // but generally you'll have an ID to give
                throw new Error("Could not locate target element. Did you forget to set attribute data-ng-sortable-id on your repeated HTML elements?")
              }
            }
          };
          if (onUpdate)  opts.onUpdate = bind(onUpdate);
          if (groupName) opts.group    = groupName;
          if (onAdd)     opts.onAdd    = bind(onAdd);
          if (onRemove)  opts.onRemove = bind(onRemove);
          if (onUpdate)  opts.onUpdate = bind(onUpdate);
          if (fauxAdd)   opts.fauxAdd  = true;

          scope.sortable = new Sortable(element.get(0), opts);
        };
      }
    }
  }];

}());
