'use strict';

module.exports = {
  'jquery': {
    exports: 'jQuery'
  },
  'bootstrap': {
    depends: {
      'jquery': 'jQuery'
    }
  }
};
