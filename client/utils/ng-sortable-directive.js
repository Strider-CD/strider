'use strict';

var _ = require('lodash');
var $ = require('jquery');
var Sortable = require('sortable');

module.exports= function ($parse) {
  return {
    compile: function ($element, attr) {
      var opts = {}
        , onAdd = null
        , onRemove = null
        , groupName = attr['ngSortableGroup']
        , onUpdate = attr['ngSortable'] || attr['ngSortableUpdate']
        , dataSource = attr['ngSortableSource']
        , model = attr['ngModel']
      ;
      if (groupName) {
        if (!dataSource)
          throw new Error("Use of a group requires specifying a data source via ng-sortable-source");
        onAdd = attr['ngSortableAdded'];
        onRemove = attr['ngSortableRemoved'];
      }
      var key = attr['ngSortableKey'] || '_id';
      return function (scope, element) {
        var bind = function (fnStr) {
          var fn = $parse(fnStr)(scope);
          return function (event) {
            scope.$apply(function() {
              var data = event.type === 'update' ? model : dataSource;
              var list = _.cloneDeep($parse(data)(scope))
                , $el = $(event.target)
                , id = $($el).attr('ng-sortable-id')
                , oldIndex = null
                , newIndex = $el.index();
              if ( ! id ) throw new Error("No ng-sortable-id on element.");
              var target = _.find(list, function (b, i) {
                oldIndex = i;
                return b[key] === id;
              });
              if (!target) {
                // this requirement can go away if we set IDs ourself during compiletime
                // but generally you'll have an ID to give
                throw new Error("Could not locate target element. Did you forget to set attribute data-ng-sortable-id on your repeated HTML elements?")
              }
              if (event.type === 'update') {
                list.splice(oldIndex, 1);
                list.splice(newIndex, 0, target);
                fn(list);
              } else if (event.type === "add") {
                fn(target, newIndex, event);
              }
            });
          }
        };
        if (onUpdate)  opts.onUpdate = bind(onUpdate);
        if (groupName) opts.group    = groupName;
        if (onAdd)     opts.onAdd    = bind(onAdd);
        if (onRemove)  opts.onRemove = bind(onRemove);
        if (onUpdate)  opts.onUpdate = bind(onUpdate);

        scope.sortable = new Sortable(element.get(0), opts);
      };
    }
  }
};
