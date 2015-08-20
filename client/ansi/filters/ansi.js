'use strict';

var ansi_up = require('ansi_up');

module.exports = function () {
  return function (input) {
    if (!input) return '';
    return ansi_up.ansi_to_html(ansi_up.escape_for_html(input));
  }
};
