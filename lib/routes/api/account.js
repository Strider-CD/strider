/*
 * routes/api/account.js
 */

var BASE_PATH = '../../';

var check = require('validator').check;
var email = require(BASE_PATH + 'email');
var models = require(BASE_PATH + 'models');
var User = models.User;

// PUT /api/account/:provider/:id
exports.save = function (req, res) {
  var accounts = req.user.accounts
    , provider = req.params.provider
    , id = req.params.id
  for (var i=0; i<accounts.length; i++) {
    if (accounts[i].provider === provider &&
        accounts[i].id === id) {
      // TODO validate these accounts
      accounts[i] = req.body
      return User.update({_id: req.user._id}, {$set: {accounts: accounts}}, function (err, effected) {
        if (effected !== 1) return res.send(500, 'failed to save one user');
        res.send(200);
      });
    }
  }
  accounts.push(req.body)
  User.update({_id: req.user._id}, {$set: {accounts: accounts}}, function (err, effected) {
    if (effected !== 1) return res.send(500, 'failed to save one user');
    res.send(200);
  });
}

// DELETE /api/account/:provider/:accountid
exports.remove = function (req, res) {
  var accounts = req.user.accounts
    , provider = req.params.provider
    , id = req.params.id
  for (var i=0; i<accounts.length; i++) {
    if (accounts[i].provider === provider &&
        accounts[i].id === id) {
      accounts.splice(i, 1)
      return req.user.save(function (err) {
        if (err) return res.send(500, 'failed to save user')
        res.send(204)
      })
    }
  }
  res.send(404, 'Account not found')
}

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
