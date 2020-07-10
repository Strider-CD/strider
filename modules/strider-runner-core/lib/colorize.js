'use strict';

module.exports = {
  message: function (message) {
    return `\u001b[35m[STRIDER]\u001b[0m ${message}\n`;
  },
  warn: function (text) {
    return `\u001b[35m[STRIDER]\u001b[0m \u001b[31;1mWARN\u001b[0m ${text}\n`;
  },
  error: function (text) {
    return `\u001b[35m[STRIDER]\u001b[0m \u001b[31;1mERROR\u001b[0m ${text}\n`;
  },
  job: function (id) {
    return `\u001b[35mJob ${id}\u001b[0m `;
  }
};
