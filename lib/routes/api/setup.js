'use strict';

var fs = require('fs');
var path = require('path');
var express = require('express');
var restart = require('../admin/plugins/restart.js');
var User = require('../../models/user');
var router = express.Router();

router.post('/', function (req, res) {
  var config = req.body;
  var data = JSON.stringify(config.general, undefined, 2);
  var configFilePath = path.join(process.cwd(), '.striderrc');
  var user = config.admin;

  console.log(require('../../config'));

  // TODO: save admin user to db
  console.log(config);
  User.create(user.email, user.password, 1, function (err, user) {
    if (err) {
      console.error(err);
      return res.status(400).json({ errors: ['Invalid user data'] });
    }

    res.json(config);

    fs.writeFile(configFilePath, data, function (err) {
      if (err) {
        throw err;
      }

      restart();
    });
  });
});

module.exports = router;
