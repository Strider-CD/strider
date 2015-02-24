'use strict';

var fs = require('fs');
var path = require('path');
var async = require('async');
var express = require('express');
var restart = require('../admin/plugins/restart.js');
var User = require('../../models/user');
var Upgrade = require('../../models/upgrade');
var router = express.Router();

router.post('/', function (req, res) {
  var configData = req.body;
  var userData = configData.admin;

  Upgrade.needConfigObj(function (err, needsConfig) {
    if (err) {
      return res.status(500).send('Database error');
    }

    if (needsConfig) {
      createConfig(config, function (err) {
        if (err) {
          return res.status(400).send('Invalid config data');
        }

        createUser(userData, function (err) {
          if (err) {
            return res.status(400).send('Invalid user data');
          }

          res.json('ok');
        });
      });
    }
  });
});

function createConfig(config, cb) {
  var Config = require('../../models/config');
  var c = new Config();

  // TODO: populate config, modify model first
  c.version = Config.SCHEMA_VERSION;

  c.save(cb);
}

function createUser(userData, cb) {
  User.create(userData.email, userData.password, 1, function (err, user) {
    if (err) {
      return cb(err);
    }

    cb(undefined, user);
  });
}

module.exports = router;
