
var filter = require('./ansi')
  , crypto = require('crypto')
  , jobs = require('./jobs')

module.exports = {
  gravatar: gravatar,
  sanitizeProject: sanitizeProject,
  sanitizeBranch: sanitizeBranch,
  sanitizeJob: jobs.small,
  timeFromId: timeFromId
}

function timeFromId(id) {
  return new Date(parseInt(id.toString().substring(0, 8), 16) * 1000)
}

function sanitizeBranch(branch) {
  var plugins = []
  for (var i=0; i<branch.plugins; i++) {
    plugins.push({id: branch.plugins[i].id, enabled: branch.plugins[i].enabled})
  }
  return {
    plugins: plugins,
    public: branch.public,
    active: branch.active,
    deploy_on_green: branch.deploy_on_green,
    runner: {
      id: branch.runner.id
    }
  }
}

function sanitizeProject(project) {
  var branches = {}
  Object.keys(project.branches).forEach(function (name) {
    if ('string' === typeof project.branches[name]) {
      branches[name] = project.branches[name]
      return
    }
    branches[name] = sanitizeBranch(project.branches[name])
  })
  return {
    _id: project._id,
    name: project.name,
    branches: branches,
    public: project.public,
    display_url: project.display_url,
    provider: {
      id: project.provider.id
    }
  }
}

function gravatar(email) {
  var hash = crypto.createHash('md5').update(email.toLowerCase()).digest("hex")
  return 'https://secure.gravatar.com/avatar/' + hash + '?d=identicon';
}
