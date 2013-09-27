
var filter = require('./ansi')
  , crypto = require('crypto')

module.exports = {
  gravatar: gravatar,
  sanitizeProject: sanitizeProject,
  sanitizeBranch: sanitizeBranch,
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

/*
module.exports.sanitizeJob = function (job) {
  var njob = {_owner: {}}
    , skip = ['_owner', 'stdmerged', 'stdout', 'stderr']
    , oskip = ['github_config', 'github_metadata', 'github', 'heroku']
    , name;
  for (name in job) {
    if (skip.indexOf(name) !== -1) continue;
    njob[name] = job[name];
  }
  for (name in job._owner) {
    if (oskip.indexOf(name) !== -1) continue;
    njob._owner[name] = job._owner[name];
  }
  njob.output = job.stdmerged ? filter(job.stdmerged) : '';
  return njob;
}
module.exports.sanitizeRepo = function (repo) {
  var safes = ['url', 'public', 'pseudo_terminal', 'display_url',
               '_id', 'active', 'prod_dev_target'];
  var saferepo = {};
  safes.forEach(function(name) {
    saferepo[name] = repo[name];
  });
  saferepo.short_name = saferepo.url.split('/').slice(-2).join('/');
  return saferepo;
}
*/
