'use strict';

var Upgrade = require('../lib/models/upgrade');
var Config = require('../lib/models').Config;
var createUser = require('./create-user');

function saveUser(email, password, admin, force) {
  Upgrade.isFreshDb(function(err, res) {
    if (res) {
      Upgrade.needConfigObj(function(err, res) {
        if (res) {
          var c = new Config();
          c.version = Config.SCHEMA_VERSION;

          c.save(function() {
            createUser(email, password, admin, force);
          });
        } else {
          createUser(email, password, admin, force);
        }
      });
    } else {
      Upgrade.ensure(Config.SCHEMA_VERSION, function(err, need) {
        createUser(email, password, admin, force);
      });
    }
  });
}

module.exports = saveUser;
