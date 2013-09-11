
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
  custom404: custom404
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
