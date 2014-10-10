'use strict';

module.exports = {
  jquery: {
    exports: 'jQuery'
  },
  bootstrap: {
    depends: {
      jquery: 'jQuery'
    }
  },
  sortable: {
    exports: 'Sortable'
  },
  ngSortableDirective: {
    exports: 'ngSortableDirective',
    depends: {
      angular: 'angular',
      sortable: 'Sortable'
    }
  },
  'ui-bootstrap': {
    depends: {
      angular: 'angular'
    }
  },
  md5: {
    exports: 'md5'
  },
  bootbox: {
    exports: 'bootbox'
  },
  codemirror: {
    exports: 'CodeMirror'
  },
  'codemirror-shell': {
    depends: {
      codemirror: 'CodeMirror'
    }
  },
  'ui-codemirror': {
    depends: {
      angular: 'angular',
      codemirror: 'CodeMirror',
      'codemirror-shell': null 
    }
  },
  'ui-sortable': {
    depends: {
      angular: 'angular'
    }
  },
  timeago: {
    depends: {
      jquery: 'jQuery'
    }
  }
};
