var logging = require('./logging');

// Legacy aliases - don't use these:
var auth = require('./auth')
exports.require_auth = auth.requireUserOr401;
exports.require_auth_browser = auth.requireUser;
exports.require_admin = auth.requireAdminOr401;
exports.require_resource_admin = auth.requireRepoAdmin;
exports.require_resource_read = auth.requireReadAccess;

// Custom middleware to save unparsed request body to req.content
exports.bodySetter = function(req, res, next) {
    if (req._post_body) return next();
    req.post_body = req.post_body || "";

    if ('POST' != req.method) return next();

    req._post_body = true;

    req.setEncoding('utf8');
    req.on('data', function(chunk) {
      req.post_body += chunk;
    });

    next();
};

// Require the specified parameters, or else return a 400 with a descriptive JSON body
exports.require_params = function require_params(params_list) {
  return function(req, res, next) {
    var errors = [];
    var status = "ok";
    var i;
    for (i = 0; i < params_list.length; i++) {
      var val = req.param(params_list[i]);
      if (!val) {
        errors.push("required parameter `"+params_list[i]+"` not found.");
        status = "error";
      }
    }
    if (errors.length === 0) {
      next();
    } else {
      var r = {
        errors: errors,
        status: status
      };
      res.statusCode = 400;

      return res.end(JSON.stringify(r, null, '\t'));
    }
  };
};

exports.custom404 = function custom404(req, res, next) {
  if ('GET' != req.method) return next();
  res.statusCode = 404;
  res.render('doesnotexist.html', 404);
};
