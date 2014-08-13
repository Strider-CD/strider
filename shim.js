'use strict';

module.exports = {
  'jquery': {
    exports: 'jQuery'
  },
  'bootstrap': {
    depends: {
      'jquery': 'jQuery'
    }
  },
  ngSortableDirective: {
    exports: 'ngSortableDirective',
    depends: {
      'angular': 'angular'
    }
  }
};
