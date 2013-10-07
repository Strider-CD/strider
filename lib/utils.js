
var filter = require('./ansi')
  , crypto = require('crypto')
  , jobs = require('./jobs')

module.exports = {
  gravatar: gravatar,
  sanitizeProject: sanitizeProject,
  sanitizeBranch: sanitizeBranch,
  sanitizeUser: sanitizeUser,
  sanitizeJob: jobs.small,
  status: jobs.status,
  timeFromId: timeFromId,
  defaultSchema: defaultSchema
}

function defaultVal(val) {
  if (val === String) return ''
  if (val === Number) return 0
  if (Array.isArray(val)) return []
  if (val === Boolean) return false
  if (val.type && !val.type.type) {
    if (val.default) return val.default
    if (val.enum) return val.enum[0]
    return defaultVal(val.type)
  }
  if ('object' === typeof val) return defaultSchema(val)
  return null
}

function defaultSchema(schema) {
  var data = {}
    , val
  for (var key in schema) {
    data[key] = defaultVal(schema[key])
  }
  return data
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

function sanitizeUser(user) {
  for (var i=0; i<user.accounts.length; i++) {
    delete user.accounts[i].cache
  }
  return user
}

function sanitizeProject(project) {
  return {
    _id: project._id,
    name: project.name,
    branches: project.branches.map(sanitizeBranch),
    public: project.public,
    display_url: project.display_url,
    display_name : project.display_name,
    provider: {
      id: project.provider.id
    }
  }
}

function gravatar(email) {
  var hash = crypto.createHash('md5').update(email.toLowerCase()).digest("hex")
  return 'https://secure.gravatar.com/avatar/' + hash + '?d=identicon';
}
