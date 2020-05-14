'use strict';

const order = [
  require('./add-user'),
  require('./restart'),
  require('./list'),
  require('./install'),
  require('./uninstall'),
  require('./upgrade'),
  require('./init'),
  require('./run-test'),
  require('./prune-jobs'),
];

module.exports.setup = function (deps, parser) {
  order.forEach(function (fn) {
    fn(deps, parser);
  });
};
