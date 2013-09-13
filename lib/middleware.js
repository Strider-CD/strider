
var logging = require('./logging')
  , auth = require('./auth')

module.exports = {
  // Legacy aliases - don't use these:
  require_auth: auth.requireUserOr401,
  require_auth_browser: auth.requireUser,
  require_admin: auth.requireAdminOr401,
  require_resource_admin: auth.requireRepoAdmin,
  require_resource_read: auth.requireReadAccess,

  bodySetter: bodySetter,
  require_params: require_params,
  custom404: custom404,

  project: project,
  projectPlugin: projectPlugin,
  projectProvider: projectProvider
}

// Custom middleware to save unparsed request body to req.content
function bodySetter(req, res, next) {
  if (req._post_body) return next()
  req.post_body = req.post_body || ""

  if ('POST' != req.method) return next()

  req._post_body = true

  req.setEncoding('utf8')
  req.on('data', function(chunk) {
    req.post_body += chunk
  })

  next()
}

// Require the specified parameters, or else return a 400 with a descriptive JSON body
function require_params(params_list) {
  return function(req, res, next) {
    var errors = []
      , status = "ok"
      , val
      , i
    for (i = 0; i < params_list.length; i++) {
      val = req.param(params_list[i])
      if (!val) {
        errors.push("required parameter `"+params_list[i]+"` not found.")
        status = "error"
      }
    }
    if (errors.length === 0) {
      next()
    } else {
      var r = {
        errors: errors,
        status: status
      }
      res.statusCode = 400

      return res.end(JSON.stringify(r, null, '\t'))
    }
  }
}

function custom404(req, res, next) {
  if ('GET' != req.method) return next()
  res.statusCode = 404
  res.render('doesnotexist.html', 404)
}

// Get plugin config. Expects req.project
// Sets `req.providerConfig` function
//   providerConfig() -> return the config
//   providerConfig(config, next(err)). save the config
function projectProvider(req, res, next) {
  var project = req.project
  req.providerConfig = function (config, next) {
    if (arguments.length === 0) {
      return project.provider
    }
    project.provider = provider
    project.markModified('provider')
    project.save(next)
  }
  next()
}

// Get plugin config. Expects req.project
// Sets `req.pluginConfig` function
//   pluginConfig() -> return the config
//   pluginConfig(config, next(err)). save the config
function projectPlugin(pluginid, req, res, next) {
  // if only 3 args, then get pluginid from params ":plugin"
  if (arguments.length === 3) {
    next = res
    res = req
    req = pluginid
    pluginid = req.params.plugin
  }
  var branch = req.project.branches[req.params.branch]
    , plugin = null
  if (!branch) {
    res.status(404)
    return res.send('Specified branch not found for the project')
  }
  // if it's just mirroring master
  if ('string' === typeof branch) {
    res.status(400)
    return res.status('Branch not individually configurable')
  }
  for (var i=0; i<branch.plugins.length; i++) {
    if (branch.plugins[i].id === pluginid) {
      plugin = branch.plugins[i]
      break;
    }
  }
  if (plugin === null) {
    res.status(404)
    return res.send('Plugin not enabled for the specified project')
  }
  req.pluginConfig = function (config, next) {
    if (arguments.length === 0) {
      return plugin.config
    }
    plugin.config = config
    project.markModified('branches')
    project.save(next)
  }
  next()
}

// getProject Middleware
// assumes two url parameters, :org and :repo, and req.user
// checks user access level, and sets the following properties on the
// request object.
//
// req.project = the project
// req.accessLevel = 0 for public, 1 for normal, 2 for admin
//
// Errors:
//   404: not found
//   401: not public and you don't have access
//   500: something strange happened w/ the DB lookup
function project(req, res, next) {
  var name = req.param.org + '/' + req.param.repo
  models.Project.findOne({name: name}, function (err, project) {
    if (err) {
      res.status(500)
      return res.send({error: 'Failed to find project', info: err})
    }
    if (!project) {
      res.status(404)
      return res.send('Project not found')
    }
    req.project = project
    if (project.public) {
      req.accessLevel = 0
      return next()
    }
    if (req.user && req.user.projects[name] > 0) {
      req.accessLevel = req.user.project[name]
      return next()
    }
    res.status(401)
    res.send('Not authorized')
  })
}
