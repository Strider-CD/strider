/*
 * routes/api/account.js
 */

var BASE_PATH = '../../lib/';

var _ = require('underscore')
  , crypto = require('crypto')
  , check = require('validator').check
  , Step = require('step')

  , auth = require(BASE_PATH + 'auth')
  , email = require(BASE_PATH + 'email')
  , gh = require(BASE_PATH + 'github')
  , heroku = require(BASE_PATH + 'heroku')
  , logging = require(BASE_PATH + 'logging')

  , api = require('./index.js')
  ;


/*
 * POST /api/account/password
 *
 * Change the password for this account.
 *
 * <password> - the new password for the account.
 */
exports.account_password = function(req, res)
{
  if (req.user !== undefined) {
    console.log("password change by " + req.user.email);
  }
  var password = req.param('password');

  if (password.length < 6) {
    res.statusCode = 400;
    res.end(JSON.stringify({status:"error",
        errors:[{"message":"password must be at least 6 characters long"}]}));
    return;
  }
  req.user.password = password;
  req.user.save(function(err, user_obj) {
    if (err) throw err;
    email.notify_password_change(req.user);
    res.end(JSON.stringify({status:"ok", errors:[]}));
  });
}

/*
 * POST /api/account/email
 *
 * Change the email for this account.
 *
 * <email> - the new email for the account.
 */
exports.account_email = function(req, res)
{

  var new_email;
  try {
    new_email = req.param('email');
    check(new_email).isEmail();
  } catch (e) {
    res.statusCode = 400;
    res.end(JSON.stringify({status:"error",
        errors:[{"message":"email is invalid"}]}));
    return;
  }
  console.log("email change from " + req.user.email + " to " + new_email);

  var old_email = req.user.email;
  req.user.email = new_email;

  req.user.save(function(err, user_obj) {
    if (err) {
      res.statusCode = 400;
      return res.end(JSON.stringify({status:"error",
          errors:[{"message":"email already in use"}]}));
    }
    email.notify_email_change(req.user, old_email);
    res.end(JSON.stringify({status:"ok", errors:[]}));
  });
}
