var express = require('express');
var router = new express.Router();
router.use('/account', require('./account'));
router.use('/admin', require('./admin'));
router.use('/session', require('./session'));
module.exports = router;
// Globals & Commons for ApiDoc ..
/**
 * @apiDefine RequestUrl Request URL Parameters
 *  Indicates that this parameter should be specified in the request URL.
 */
/**
 * @apiDefine RequestBody Request Body Parameters
 *  Indicates that this parameter should be specified in the request body.
 */
/**
 * @apiDefine ProjectAdmin
 *  You must have admin privileges on the corresponding RepoConfig to be able to use this endpoint.
 */
/**
 * @apiDefine GlobalAdmin
 *  You must have admin privileges in Strider (globally) in order to use this endpoint.
 */
/**
 * @apiDefine ProjectReference
 *
 * @apiParam (RequestUrl) {String} org The organization name for the project.  This is
 * usually a GitHub user or organization name (e.g. "strider" in "strider-cd/strider")
 * but may vary from one project provider to another. (as another example,
 * in GitLab this refers to the repository's "group").
 * @apiParam (RequestUrl) {String} repo The project's repository name.
 */
//# sourceMappingURL=index.js.map