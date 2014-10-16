var BASE_PATH = "../../"
  , Project = require(BASE_PATH + 'models').Project

module.exports =
  { post: post
  , put: put
  , del: del
  }

/*
 * POST /:org/:repo/branches/
 *
 * Add a new branch for a project. You must have admin privileges on the corresponding RepoConfig
 * to be able to use this endpoint.
 *
 */
function post(req, res) {
  req.project.addBranch(req.param('name'), function (err, branch) {
    if (err) return res.send(500, err.message)
    res.send({ created: true, message: 'Branch added', branch: branch })
  })
}

/*
 * PUT /:org/:repo/branches/
 *
 * Used to update the order of branches
 *
 */
function put(req, res) {
  var branches = req.param('branches')
    , query = { _id: req.project._id }
    , update = { '$set': { branches: branches } }

  Project.update(query, update, function (err) {
    if (err) return res.send(500, err.message)
    res.send({ status: 'updated', message: 'Branch order updated' })
  })
}

/*
 * DELETE /:org/:repo/branches/
 *
 * Delete the specified branch from the project
 *
 */
function del(req, res) {
  var name = req.param('name')
    , query = { _id: req.project._id }
    , update = { '$pull': { branches: { name: name } } }

  if (name.toLowerCase() === 'master') {
    return res.send(400, 'Cannot remove the master branch')
  }

  Project.update(query, update, function (err) {
    if (err) return res.send(500, err.message)
    res.send({ status: 'removed' })
  })
}
