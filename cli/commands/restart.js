'use strict';

module.exports = function (deps, parser) {
  parser
    .command('restart')
    .help('Restart strider (touch .strider)')
    .callback(function () {
      require('../lib/resilient')(deps).restart();
    });
};
