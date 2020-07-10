'use strict';

var execa = require('execa');

module.exports = function (command, args, options, done) {
  try {
    done(null, execa(command, args, options));
  } catch (e) {
    done(127);
  }
};
