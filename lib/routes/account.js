'use strict';

var express = require('express');
var pjson = require('../../package.json');
var utils = require('../utils');
var common = require('../common');
var router = express.Router();

/*
 * GET /account - account settings page
 */
router.get('/', function (req, res) {
  var hosted = {};
  var providers = common.userConfigs.provider;

  for (var id in providers) {
    if (common.extensions.provider[id].hosted) {
      hosted[id] = providers[id];
    }
  }

  res.format({
    html: function() {
      res.render('account.html', {
        user: utils.sanitizeUser(req.user.toJSON()),
        providers: hosted,
        userConfigs: common.userConfigs,
        flash: req.flash('account'),
        version: pjson.version
      });
    },
    json: function() {
      res.send({
        user: utils.sanitizeUser(req.user.toJSON()),
        providers: hosted,
        userConfigs: common.userConfigs
      });
    }
  })
});

module.exports = router;
