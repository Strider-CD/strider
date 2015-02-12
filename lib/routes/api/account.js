'use strict'

var express = require('express');
var validator = require('validator');
var email = require('../../email');
var models = require('../../models');
var auth = require('../../auth');
var router = express.Router();
var User = models.User;

router.use(auth.requireUserOr401);

router.route('/:provider/:id')
  .put(function (req, res) {
    var accounts = req.user.accounts;
    var provider = req.params.provider;
    var id = req.params.id;

    for (var i=0; i<accounts.length; i++) {
      if (accounts[i].provider === provider &&
          accounts[i].id === id) {
        // TODO validate these accounts
        accounts[i] = req.body;

        return User.update({_id: req.user._id}, {$set: {accounts: accounts}}, function (err, effected) {
          if (effected !== 1) {
            return res.send(500, 'failed to save one user');
          }

          res.send(200);
        });
      }
    }

    accounts.push(req.body);

    User.update({_id: req.user._id}, {$set: {accounts: accounts}}, function (err, effected) {
      if (effected !== 1) return res.send(500, 'failed to save one user');
      res.send(200);
    });
  })
  .delete(function (req, res) {
    var accounts = req.user.accounts;
    var provider = req.params.provider;
    var id = req.params.id;

    for (var i=0; i<accounts.length; i++) {
      if (accounts[i].provider === provider &&
          accounts[i].id === id) {
        accounts.splice(i, 1);

        return req.user.save(function (err) {
          if (err) {
            return res.send(500, 'failed to save user');
          }

          res.send(204);
        });
      }
    }

    res.send(404, 'Account not found');
  });

/*
 * POST /api/account/password
 *
 * Change the password for this account.
 *
 * <password> - the new password for the account.
 */
router.route('/password')
  .post(function(req, res) {
    if (req.user !== undefined) {
      console.log("password change by " + req.user.email);
    }

    var password = req.body.password;

    if (password.length < 6) {
      return res.status(400).json({
        status:"error",
        errors:[{"message":"password must be at least 6 characters long"}]
      });
    }

    req.user.password = password;

    req.user.save(function(err, user_obj) {
      if (err) {
        throw err;
      }

      email.notify_password_change(req.user);

      res.json({
        status: "ok",
        errors:[]
      });
    });
  });


/*
 * POST /api/account/email
 *
 * Change the email for this account.
 *
 * <email> - the new email for the account.
 */
 router.route('/email')
  .post(function(req, res) {
    var newEmail = req.body.email;

    if (!validator.isEmail(newEmail)) {
      return res.status(400).json({

        status:"error",
        errors:[{"message":"email is invalid"}]
      });
    }

    console.log("email change from " + req.user.email + " to " + newEmail);

    var oldEmail = req.user.email;
    req.user.email = newEmail;

    req.user.save(function(err, user_obj) {
      if (err) {
        return res.status(400).json({
          status:"error",
          errors:[{"message":"email already in use"}]
        });
      }

      email.notify_email_change(req.user, oldEmail);
      res.json({ status:"ok", errors:[] });
    });
  });

module.exports = router;
