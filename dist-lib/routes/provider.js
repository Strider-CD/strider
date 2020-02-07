var _ = require('lodash');
var express = require('express');
var debug = require('debug')('strider:routes:provider');
var auth = require('../auth');
var middleware = require('../middleware');
var common = require('../common');
var utils = require('../utils');
var router = new express.Router();
var rootRoute = router.route('/:org/:repo/provider');
rootRoute.all(auth.requireUserOr401, middleware.project, auth.requireProjectAdmin);
/**
 * @api {get} /:org/:repo/provider Get Project Provider
 * @apiUse ProjectReference
 * @apiDescription Get the provider config for the specified project
 * @apiName GetProjectProvider
 * @apiGroup Provider
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} CURL Example:
 *    curl -X GET http://localhost:3000/strider-cd/strider/provider
 */
rootRoute.get(function (req, res) {
    res.send(req.project.provider.config);
});
/**
 * @api {post} /:org/:repo/provider Update Project Provider
 * @apiUse ProjectReference
 * @apiDescription Update a project's provider
 * @apiName UpdateProjectProvider
 * @apiGroup Provider
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} CURL Example:
 *    curl -X POST http://localhost:3000/strider-cd/strider/provider
 */
rootRoute.post(function (req, res) {
    var providerId = req.project.provider.id;
    debug(`Provider Id: ${providerId}`);
    var providerConfig = common.extensions.provider[providerId].config;
    var config = utils.validateAgainstSchema(req.body, providerConfig);
    // Update project's provider config
    _.extend(req.project.provider.config, config);
    debug(`New provider config: ${JSON.stringify(req.project.provider.config)}`);
    req.project.markModified('provider.config');
    req.project.save(function (err, project) {
        if (err) {
            debug(`Save error: ${err.message}`);
            return res.status(500).send({
                error: 'Failed to save provider config'
            });
        }
        res.send(project.provider.config);
    });
});
module.exports = router;
//# sourceMappingURL=provider.js.map