var auth = require('../../auth');
var config = require('../../config');
var debug = require('debug')('strider:routes:api:account');
var email = require('../../email');
var express = require('express');
var models = require('../../models');
var Project = models.Project;
var router = express.Router();
var User = models.User;
var validator = require('validator');

router.use(auth.requireUserOr401);

router
  .route('/:provider/:id')

  /**
   * @api {put} /account/:provider/:id Update Provider Account
   * @apiDescription Updates a provider account for the _active_ user (the API user).
   * @apiName UpdateAccount
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiParam {String} provider Type of provider, e.g. github
   * @apiParam {Number} id Unique provider identification
   */
  .put(function(req, res) {
    var accounts = req.user.accounts;
    var provider = req.params.provider;
    var id = req.params.id;

    for (var i = 0; i < accounts.length; i++) {
      if (accounts[i].provider === provider && accounts[i].id === id) {
        // TODO validate these accounts
        accounts[i] = req.body;

        return User.updateOne(
          { _id: req.user._id },
          { $set: { accounts: accounts } },
          function(err) {
            if (err) {
              debug(err);
              return res.status(500).send('Failed to save one user');
            }

            res.sendStatus(200);
          }
        );
      }
    }

    accounts.push(req.body);

    User.updateOne(
      { _id: req.user._id },
      { $set: { accounts: accounts } },
      function(err) {
        if (err) {
          debug(err);
          return res.status(500).send('Failed to save one user');
        }

        res.sendStatus(200);
      }
    );
  })

  /**
   * @api {delete} /account/:provider/:id Delete Provider Account
   * @apiDescription Deletes a provider account for the _active_ user (the API user).
   * @apiName DeleteAccount
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiParam {String} provider Type of provider, e.g. github
   * @apiParam {Number} id Unique provider identification
   */
  .delete(function(req, res) {
    var accounts = req.user.accounts;
    var provider = req.params.provider;
    var id = req.params.id;
    var accountRemoved = false;

    Project.find({ 'provider.id': provider })
      .lean()
      .exec(function(err, projects) {
        if (err) {
          return res.status(400).send('Failed do to bad data');
        }

        if (projects.length) {
          var projectNames = projects.map(function(project) {
            return project.name;
          });
          return res
            .status(403)
            .send(
              `Cannot delete provider since projects are using this provider: ${projectNames.join(
                ', '
              )}`
            );
        } else {
          accounts.forEach(function(account, index) {
            if (account.provider === provider && account.id === id) {
              accounts.splice(index, 1);
              accountRemoved = true;
            }
          });

          if (accountRemoved) {
            return req.user.save(function(err) {
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

router
  .route('/password')

  /**
   * @api {post} /account/password Change Password
   * @apiDescription Changes the password for the _active_ user (the API user).
   * @apiName ChangePassword
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiParam (RequestBody) {String{6..}} password The new password, which must be at least 6 characters long.
   */
  .post(function(req, res) {
    if (req.user !== undefined) {
      debug(`password change by ${req.user.email}`);
    }

    if (req.user.isAdUser) {
      return res.status(400).json({
        status: 'error',
        errors: [{ message: 'The ldap user can not change password.' }]
      });
    }
    var password = req.body.password;

    if (password.length < 6) {
      return res.status(400).json({
        status: 'error',
        errors: [{ message: 'password must be at least 6 characters long' }]
      });
    }

    req.user.password = password;

    req.user.save(function(err) {
      if (err) {
        throw err;
      }

      email.notifyPasswordChange(req.user);

      res.json({
        status: 'ok',
        errors: []
      });
    });
  });

router
  .route('/email')

  /**
   * @api {post} /account/email Change Email
   * @apiDescription Changes the email address for the _active_ user (the API user).
   * @apiName ChangeEmail
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiParam (RequestBody) {String} email The new email address. This must be a VALID email address.
   */
  .post(function(req, res) {
    var newEmail = req.body.email;

    if (!validator.isEmail(newEmail)) {
      return res.status(400).json({
        status: 'error',
        errors: [{ message: 'email is invalid' }]
      });
    }

    debug(`email change from ${req.user.email} to ${newEmail}`);

    if (req.user.isAdUser) {
      return res.status(400).json({
        status: 'error',
        errors: [{ message: 'The ldap user can not change email.' }]
      });
    }

    var oldEmail = req.user.email;
    req.user.email = newEmail;

    req.user.save(function(err) {
      if (err) {
        return res.status(400).json({
          status: 'error',
          errors: [{ message: 'email already in use' }]
        });
      }

      email.notifyEmailChange(req.user, oldEmail);
      res.json({ status: 'ok', errors: [] });
    });
  });

router
  .route('/jobsQuantityOnPage')

  /**
   * @api {post} /account/jobsQuantityOnPage Change jobs quantity on page
   * @apiDescription Changes the jobs quantity on page for the _active_ user (the API user).
   * @apiName ChangeJobsQuantityOnPage
   * @apiGroup Account
   * @apiVersion 1.0.0
   *
   * @apiParam (RequestBody) {Number} quantity The new value.
   */
  .post(function(req, res) {
    if (!config.jobsQuantityOnPage.enabled) {
      return res.status(400).json({
        status: 'error',
        errors: [{ message: 'quantity customization is disabled' }]
      });
    }

    var newQuantity = req.body.quantity;

    if (
      newQuantity < config.jobsQuantityOnPage.min ||
      newQuantity > config.jobsQuantityOnPage.max
    ) {
      return res.status(400).json({
        status: 'error',
        errors: [
          {
            message: `quantity must be between ${config.jobsQuantityOnPage.min} and ${config.jobsQuantityOnPage.max}`
          }
        ]
      });
    }

    debug(
      `jobs quantity on page change from ${req.user.jobsQuantityOnPage} to ${newQuantity}`
    );

    req.user.jobsQuantityOnPage = newQuantity;

    req.user.save(function() {
      res.json({ status: 'ok', errors: [] });
    });
  });

module.exports = router;
