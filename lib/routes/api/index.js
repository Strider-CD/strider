'use strict';

var express = require('express');
var router = express.Router();

router.use('/account', require('./account'));
router.use('/admin', require('./admin'));

module.exports = router;
