'use strict';

var Router = require('co-router');
var Project = require('../../models').Project;
var middleware = require('../../middleware');
var router = new Router();
var requireBody = middleware.requireBody;
var root = router.route('/');

/**
 * @api {post} /:org/:repo/environments Add Environment
 * @apiUse ProjectReference
 * @apiPermission ProjectAdmin
 * @apiDescription Add a new environment for a project.
 * @apiName AddEnvironment
 * @apiGroup Environment
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} CURL Example:
 *    curl -X POST -d name=newenvironment http://localhost/api/strider-cd/strider/environments
 *
 * @apiParam (RequestBody) {String} name The name of the new environment
 * @apiParam (RequestBody) {String} cloneName The name of the cloned environment
 */
root.post(requireBody(['name']), function * addOrCloneEnvironment(req, res) {
  try {
    let name = req.body.name;
    let cloneName = req.body.cloneName;
    let environment;

    if (cloneName) {
      environment = yield req.project.cloneEnvironment(name, cloneName);
    } else {
      environment = yield req.project.addEnvironment(name);
    }

    let action = cloneName ? 'cloned' : 'added';

    res.send({
      created: true,
      message: `Environment ${action}`,
      environment
    });
  } catch(err) {
    res.status(500).send(err.message);
  }
});

/**
 * @api {delete} /:org/:repo/environments Delete Environment
 * @apiUse ProjectReference
 * @apiPermission ProjectAdmin
 * @apiDescription Deletes an environment from a project
 * @apiName DeleteEnvironment
 * @apiGroup Environment
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} CURL Example:
 *    curl -X DELETE -d name=myenv http://localhost/api/strider-cd/strider/environments
 *
 * @apiParam (RequestBody) {String} name The name of the environment to delete
 */
root.delete(requireBody(['name']), function * deleteEnvironment(req, res) {
  var name = req.body.name;
  var query = { _id: req.project._id };
  var update = {
    '$pull': { branches: { name } }
  };

  try {
    yield Project.update(query, update);
    res.send({ status: 'removed' });
  } catch(err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;
