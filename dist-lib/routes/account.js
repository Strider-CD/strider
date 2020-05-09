const express = require('express');
const pjson = require('../../package.json');
const utils = require('../utils');
const common = require('../common');
const router = express.Router();
const config = require('../config');
/*
 * GET /account - account settings page
 */
router.get('/', function (req, res) {
    const hosted = {};
    const providers = common.userConfigs.provider;
    for (const id in providers) {
        if (common.extensions.provider[id].hosted) {
            hosted[id] = providers[id];
        }
    }
    res.format({
        html: function () {
            res.render('account.html', {
                user: utils.sanitizeUser(req.user.toJSON()),
                providers: hosted,
                userConfigs: common.userConfigs,
                jobsQuantityOnPage: config.jobsQuantityOnPage,
                flash: req.flash('account'),
                version: pjson.version,
            });
        },
        json: function () {
            res.send({
                user: utils.sanitizeUser(req.user.toJSON()),
                providers: hosted,
                userConfigs: common.userConfigs,
            });
        },
    });
});
module.exports = router;
//# sourceMappingURL=account.js.map