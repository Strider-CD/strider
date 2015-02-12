'use strict';

var express = require('express');
var Project = require('../../models').Project
var middleware = require('../../middleware');
var router = express.Router();
var requireBody = middleware.requireBody;
var root = router.route('/');

  /*
   * POST /:org/:repo/branches/
   *
   * Add a new branch for a project. You must have admin privileges on the corresponding RepoConfig
   * to be able to use this endpoint.
   *
   */
  root.post(requireBody(['name']), function (req, res) {
    req.project.addBranch(req.body.name, function (err, branch) {
      if (err) return res.send(500, err.message)
      res.send({ created: true, message: 'Branch added', branch: branch })
    })
  });

  /*
   * PUT /:org/:repo/branches/
   *
   * Used to update the order of branches
   *
   */
  root.put(requireBody(['branches']), function (req, res) {
    var branches = req.body.branches
      , query = { _id: req.project._id }
      , update = { '$set': { branches: branches } }

    Project.update(query, update, function (err) {
      if (err) return res.send(500, err.message)

      res.send({ status: 'updated', message: 'Branch order updated' })
    })
  });

  /*
   * DELETE /:org/:repo/branches/
   *
   * Delete the specified branch from the project
   *
   */
  root.delete(requireBody(['name']), function (req, res) {
    var name = req.body.name
      , query = { _id: req.project._id }
      , update = { '$pull': { branches: { name: name } } }

    if (name.toLowerCase() === 'master') {
      return res.send(400, 'Cannot remove the master branch')
    }

    Project.update(query, update, function (err) {
      if (err) return res.send(500, err.message)
      res.send({ status: 'removed' })
    })

  });

module.exports = router;
