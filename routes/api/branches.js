var BASE_PATH = "../../lib/"
  , Project = require(BASE_PATH + 'models').Project

module.exports =
  { post: post
  , del: del
  }

/*
 * POST /:org/:repo/branches/
 *
 * Add a new collaborator branch for a project. You must have admin privileges on the corresponding RepoConfig
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
