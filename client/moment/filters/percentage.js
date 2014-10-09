'use strict';

module.exports = function () {
  return function (input, prec) {
    if (!input && parseInt(input) !== 0) return '';
    var by = Math.pow(10, prec || 1)
    return parseInt(parseFloat(input) * by, 10)/by + '%'
  }
};
