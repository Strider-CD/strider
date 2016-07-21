'use strict';

var express = require('express');
var Project = require('../../models').Project;
var middleware = require('../../middleware');
var router = express.Router();
var requireBody = middleware.requireBody;
var root = router.route('/');

/**
 * @api {post} /:org/:repo/branches Add Branch
 * @apiUse ProjectReference
 * @apiPermission ProjectAdmin
 * @apiDescription Add a new branch for a project.
 * @apiName AddBranch
 * @apiGroup Branch
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} CURL Example:
 *    curl -X POST -d name=newbranch http://localhost/api/strider/strider-cd/branches
 *
 * @apiParam (RequestBody) {String} name The name of the new branch
 * @apiParam (RequestBody) {String} cloneName The name of the cloned branch
 */
root.post(requireBody(['name']), function (req, res) {
  if (req.body.cloneName) {
    req.project.cloneBranch(req.body.name, req.body.cloneName, function (err, branch) {
      res.send({created: true, message: 'Branch cloned', branch: branch});
    });
  } else {
    req.project.addBranch(req.body.name, function (err, branch) {
      if (err) return res.status(500).send(err.message);
      res.send({created: true, message: 'Branch added', branch: branch});
    });
  }
});

/**
 * @api {put} /:org/:repo/branches Reorder Branches
 * @apiUse ProjectReference
 * @apiPermission ProjectAdmin
 * @apiDescription Updates the branch order for a project.
 * @apiName ReorderBranches
 * @apiGroup Branch
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} CURL Example:
 *    curl -X PUT -d branches=master,testing http://localhost/api/strider/strider-cd/branches
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
 *    curl -X DELETE -d name=mybranch http://localhost/api/strider/strider-cd/branches
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
