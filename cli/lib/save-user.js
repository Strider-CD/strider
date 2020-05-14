'use strict';

module.exports = function (deps) {
  var createUser = require('./create-user')(deps);
  var Upgrade = deps.upgrade();
  var Config = deps.models().Config;

  function saveUser(email, password, admin, rl, force) {
    Upgrade.isFreshDb(function (err, isFresh) {
      if (isFresh) {
        Upgrade.needConfigObj(function (err, needsConfig) {
          if (needsConfig) {
            var c = new Config();

            c.version = Config.SCHEMA_VERSION;

            c.save(function () {
              createUser(email, password, admin, rl, force);
            });
          } else {
            createUser(email, password, admin, rl, force);
          }
        });
      } else {
        Upgrade.ensure(Config.SCHEMA_VERSION, function () {
          createUser(email, password, admin, rl, force);
        });
      }
    });
  }

  return saveUser;
};
