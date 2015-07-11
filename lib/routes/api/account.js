'use strict'

var express = require('express');
var validator = require('validator');
var email = require('../../email');
var models = require('../../models');
var auth = require('../../auth');
var router = express.Router();
var User = models.User;
var Project = models.Project;

router.use(auth.requireUserOr401);

/**
 * @api {put} /:provider/:id Update a User's provider account 
 * @apiName UpdateAccount
 * @apiGroup Account
 *
 * @apiParam {String} provider Type of provider, e.g. github
 * @apiParam {Number} id Unique provider identification
 */
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
            return res.status(500).send('Failed to save one user');
          }

          res.sendStatus(200);
        });
      }
    }

    accounts.push(req.body);

    User.update({_id: req.user._id}, {$set: {accounts: accounts}}, function (err, effected) {
      if (effected !== 1) {
        return res.status(500).send('Failed to save one user');
      }

      res.sendStatus(200);
    });
  })
  .delete(function (req, res) {
    var accounts = req.user.accounts;
    var provider = req.params.provider;
    var id = req.params.id;
    var accountRemoved = false;

    Project.find({ 'provider.id': provider })
      .lean()
      .exec(function (err, projects) {
        if (err) {
          return res.status(400).send('Failed do to bad data');
        }

        if (projects.length) {
          var projectNames = projects.map(function (project) {
             return project.name;
          });
          return res.status(403)
            .send('Cannot delete provider since projects are using this provider: ' +
              projectNames.join(', '));
        } else {
          accounts.forEach(function (account, index) {
            if (account.provider === provider && account.id === id) {
              accounts.splice(index, 1);
              accountRemoved = true;
            }
          });

          if (accountRemoved) {
            return req.user.save(function (err) {
              if (err) {
                return res.status(500).send('Failed to save user');
              }

              res.sendStatus(204);
            });
          }

          res.status(404).send('Account not found');
        }
      });
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
      console.log('password change by ' + req.user.email);
    }

    var password = req.body.password;

    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        errors:[{ message: 'password must be at least 6 characters long' }]
      });
    }

    req.user.password = password;

    req.user.save(function(err, user_obj) {
      if (err) {
        throw err;
      }

      email.notify_password_change(req.user);

      res.json({
        status: 'ok',
        errors: []
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

        status: 'error',
        errors:[{ message: 'email is invalid' }]
      });
    }

    console.log('email change from ' + req.user.email + ' to ' + newEmail);

    var oldEmail = req.user.email;
    req.user.email = newEmail;

    req.user.save(function(err, user_obj) {
      if (err) {
        return res.status(400).json({
          status: 'error',
          errors:[{ message: 'email already in use' }]
        });
      }

      email.notify_email_change(req.user, oldEmail);
      res.json({ status: 'ok', errors: [] });
    });
  });

module.exports = router;
