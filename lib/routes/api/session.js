var BASE_PATH = '../../';

var models = require(BASE_PATH + 'models')
  , User   = models.User;


/**
 * @api {post} /api/session Create New Session
 * @apiDescription Creates a new user session after validating an email address and password pair.
 * @apiName CreateSession
 * @apiGroup Session
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} CURL Example:
 *    curl -X POST -d email=me@me.com -d password=mypass http://localhost/api/session
 *
 * @apiParam (RequestBody) {String} email The email address to login as (which is used as the username).
 * @apiParam (RequestBody) {String} password The user's password.
 */
exports.create = function createSession(req, res, next) {
  User.authenticate(req.body.email, req.body.password, function (err, user) {
    if (!user) {
      res.send(404, {message: 'No such username / password'});
    } else {
      req.session.passport.user = user.id;
      res.send(user);
    }
  });
};

/**
 * @api {get} /api/session Get Session
 * @apiDescription Gets the current session information
 * @apiName GetSession
 * @apiGroup Session
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} CURL Example:
 *    curl -X GET http://localhost/api/session
 */
exports.get = function getSession(req, res, next) {
  res.send({user: req.user});
};
