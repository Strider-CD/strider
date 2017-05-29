'use strict';

var express = require('express');
var Project = require('../../models').Project;
var middleware = require('../../middleware');
var router = express.Router();
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
root.post(requireBody(['name']), function (req, res) {
  if (req.body.cloneName) {
    req.project.cloneEnvironment(req.body.name, req.body.cloneName, function (err, environment) {
      res.send({
        created: true,
        message: 'Environment cloned',
        environment
      });
    });
  } else {
    req.project.addEnvironment(req.body.name, function (err, environment) {
      if (err) return res.status(500).send(err.message);
      res.send({
        created: true,
        message: 'Environment added',
        environment
      });
    });
  }
});

/**
 * @api {put} /:org/:repo/environments Reorder Branches
 * @apiUse ProjectReference
 * @apiPermission ProjectAdmin
 * @apiDescription Updates the branch order for a project.
 * @apiName ReorderBranches
 * @apiGroup Branch
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} CURL Example:
 *    curl -X PUT -d branches=master,testing http://localhost/api/strider-cd/strider/branches
 *
 * @apiParam (RequestBody) {String} branches The new branch order, comma delimited
 */
root.put(requireBody(['branches']), function (req, res) {
  var branches = req.body.branches;
  var query = {_id: req.project._id};
  var update = {'$set': {branches: branches}};

  Project.update(query, update, function (err) {
    if (err) return res.status(500).send(err.message);

    res.send({status: 'updated', message: 'Branch order updated'});
  });
});

/**
 * @api {delete} /:org/:repo/branches Delete Branch
 * @apiUse ProjectReference
 * @apiPermission ProjectAdmin
 * @apiDescription Deletes a branch from a project
 * @apiName DeleteBranch
 * @apiGroup Branch
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} CURL Example:
 *    curl -X DELETE -d name=mybranch http://localhost/api/strider-cd/strider/branches
 *
 * @apiParam (RequestBody) {String} name The name of the branch to delete
 */
root.delete(requireBody(['name']), function (req, res) {
  var name = req.body.name;
  var query = {_id: req.project._id};
  var update = {'$pull': {branches: {name: name}}};

  if (name.toLowerCase() === 'master') {
    return res.status(400).send('Cannot remove the master branch');
  }

  Project.update(query, update, function (err) {
    if (err) return res.status(500).send(err.message);
    res.send({status: 'removed'});
  });

});

module.exports = router;
