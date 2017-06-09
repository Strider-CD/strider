'use strict';

var Router = require('co-router');
var Project = require('../../models').Project;
var middleware = require('../../middleware');
var router = new Router();
var requireBody = middleware.requireBody;
var root = router.route('/');

/**
 * @api {post} /:org/:repo/environments Add/Clone Environment
 * @apiUse ProjectReference
 * @apiPermission ProjectAdmin
 * @apiDescription Add or clone a new environment for a project.
 * @apiName AddCloneEnvironment
 * @apiGroup Environment
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} CURL Clone Example:
 *    curl -X POST -d '{"name":"newenv","cloneId":"idhere"}' http://localhost/api/strider-cd/strider/environments
 * 
 * @apiExample {curl} CURL Add Example:
 *    curl -X POST -d '{"name":"newenv"}' http://localhost/api/strider-cd/strider/environments
 *
 * @apiParam (RequestBody) {String} name The name of the new environment
 * @apiParam (RequestBody) {String} cloneId The id of the environment to clone
 */
root.post(requireBody(['name']), function * addOrCloneEnvironment(req, res) {
  try {
    let { name, cloneId } = req.body;
    let environment;

    if (cloneId) {
      environment = yield req.project.cloneEnvironment(name, cloneId);
    } else {
      environment = yield req.project.addEnvironment(name);
    }

    let action = cloneId ? 'cloned' : 'added';

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
 *    curl -X DELETE -d '{ "id": "myenvid" }' http://localhost/api/strider-cd/strider/environments
 *
 * @apiParam (RequestBody) {String} id The id of the environment to delete
 */
root.delete(requireBody(['id']), function * deleteEnvironment(req, res) {
  var id = req.body.id;
  var query = { _id: req.project._id };
  var update = {
    '$pull': { environments: { id } }
  };

  try {
    yield Project.update(query, update);
    res.send({ status: 'removed' });
  } catch(err) {
    return res.status(500).send(err.message);
  }
});

module.exports = router;
