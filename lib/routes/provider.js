'use strict';

var _ = require('lodash');
var express = require('express');
var common = require('../common');
var utils = require('../utils');
var router = new express.Router();

router.route('/:org/:repo/provider/')
  .get(function (req, res) {
    res.send(req.project.provider.config);
  })
  .post(function (req, res) {
    var providerConfig = common.extensions.provider[req.project.provider.id].config;
    var config = utils.validateAgainstSchema(req.body, providerConfig);

    // Update project's provider config
    _.extend(req.project.provider.config, config);
    req.project.markModified('provider.config');

    req.project.save(function (err, project) {
      if (err) {
        return res.status(500).send({
          error: 'Failed to save provider config'
        });
      }

      res.send(project.provider.config);
    });
  });

module.exports = router;
