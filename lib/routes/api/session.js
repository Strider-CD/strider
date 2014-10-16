var BASE_PATH = '../../';

var models = require(BASE_PATH + 'models')
  , User   = models.User


/*
 * POST /api/session
 *
 * Create a new session
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

/*
 * GET /api/session
 *
 * Get current session, containing user id
 */
exports.get = function getSession(req, res, next) {
  res.send({user: req.user});
};
