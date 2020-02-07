'use strict';
var express = require('express');
var router = new express.Router();
router.use('/account', require('./account'));
router.use('/admin', require('./admin'));
router.use('/session', require('./session'));
module.exports = router;
//# sourceMappingURL=index.js.map