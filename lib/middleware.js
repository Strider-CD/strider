var logging = require('./logging');

// Require a logged in session
exports.require_auth = function require_auth(req, res, next){
    if (req.user !== undefined){
        next();
    } else {
        res.statusCode = 401;
        res.end("not authorized");
    }
};

exports.require_auth_browser = function require_auth(req, res, next) {
  if (req.user != undefined) {
    next();
  } else {
    req.session.return_to = req.url
    res.redirect("/login");
  }
};

// Require admin privileges
exports.require_admin = function require_admin(req, res, next){
    if (req.user === undefined || req.user['account_level'] === undefined || req.user.account_level < 1){
        res.statusCode = 401;
        res.end("not authorized");
    } else {
        next();
    }
};

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

// Require the logged-in user to have admin access to the repository in the
// URI path.
// E.g. http://striderapp.com/beyondfog/strider/latest_build
exports.require_resource_admin = function require_resource_admin(req, res, next) {
  var org = req.params.org;
  var repo = req.params.repo;
  var repo_url = "https://github.com/" + org + "/" + repo;
  if (req.user === undefined) {
        console.log("anonymous user attempted to view " + repo_url + " without authorization.");
        res.statusCode = 401;
        res.end("not authorized");
  } else {
    req.user.get_repo_config(repo_url, function(err, repo, access_level) {
      if (err || !repo || access_level < 1) {
        console.log("user '" + req.user.email + "' attempted to view " + repo_url + " without authorization.");
        res.statusCode = 401;
        return res.end("not authorized");
      }
      req.repo_url = repo_url;
      next();
    });
  }
};
//
// Require the logged-in user to have at least read-only access to the repository in the
// URI path.
// E.g. http://striderapp.com/beyondfog/strider/latest_build
exports.require_resource_read = function require_resource_read(req, res, next) {
  var org = req.params.org;
  var repo = req.params.repo;
  var repo_url = "https://github.com/" + org + "/" + repo;
  if (req.user === undefined) {
        console.log("anonymous user attempted to view " + repo_url + " without authorization.");
        res.statusCode = 401;
        res.end("not authorized");
  } else {
    req.user.get_repo_config(repo_url, function(err, repo, access_level) {
      if (err || !repo) {
        console.log("user '" + req.user.email + "' attempted to view " + repo_url + " without authorization.");
        res.statusCode = 401;
        return res.end("not authorized");
      }
      req.repo_url = repo_url;
      next();
    });
  }
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
  res.render('doesnotexist', 404);
};
