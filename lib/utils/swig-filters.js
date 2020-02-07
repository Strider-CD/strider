'use strict';

module.exports = {
  scriptjson: function (input) {
    return JSON.stringify(input).replace(/<\//g, '<\\/');
  }
};
