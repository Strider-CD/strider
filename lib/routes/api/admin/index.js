var auth = require('../../../auth');
var debug = require('debug')('strider:routes:api:admin');
var email = require('../../../email');
var express = require('express');
var requireBody = require('../../../utils/require-body');
var router = new express.Router();
var InviteCode = require('../../../models').InviteCode;
var User = require('../../../models').User;

router.use(auth.requireAdminOr401);

/**
 * @api {get} /admin/users Get All Users
 * @apiPermission GlobalAdmin
 * @apiDescription Retrieves a list of all Strider users.
 * @apiName GetUsers
 * @apiGroup Admin
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} CURL Example:
 *    curl -X GET http://localhost/admin/users
 */
router.route('/users').get(function(req, res) {
  var users = [];

  User.find({})
    .sort({ email: 1 })
    .exec(function(err, results) {
      results.forEach(function(user) {
        users.push({
          id: user.id,
          email: user.email
        });
      });

      res.json(users);
    });
});

/**
 * @apiIgnore
 * @api {get} /admin/jobs Get Job Status
 * @apiPermission GlobalAdmin
 * @apiDescription Returns a JSON object of the last 100 jobs executed.
 * @apiName GetJobs
 * @apiGroup Admin
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} CURL Example:
 *    curl -X GET http://localhost/admin/jobs
 */
router.route('/jobs').get(function(req, res) {
  res.status(500).send('Not yet implemented');
});

/**
 * @api {post} /admin/invite/new Send Invite
 * @apiPermission GlobalAdmin
 * @apiDescription Create & email a new Strider invite.
 * @apiName SendInvite
 * @apiGroup Admin
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} CURL Example:
 *    curl -X POST -d invite_code=xoxox -d email=new_guy@strider-cd.com http://localhost/invite/new
 *
 * @apiParam (RequestBody) {String} invite_code The invite code/token to use in the invitation
 * @apiParam (RequestBody) {String} email The email address of the new user being invited
 */
router.route('/invite/new').post(function(req, res) {
  var inviteCode = requireBody('invite_code', req, res);
  var emailAddr = requireBody('email', req, res);

  if (inviteCode === undefined || emailAddr === undefined) {
    return;
  }

  var invite = new InviteCode();

  invite.code = inviteCode;
  invite.created_timestamp = new Date();
  invite.emailed_to = emailAddr;

  invite.save(function(err, invite) {
    email.sendInvite(invite.code, emailAddr);
    res.redirect('/admin/invites');
  });
});

/**
 * @api {post} /admin/invite/revoke Revoke Invite
 * @apiPermission GlobalAdmin
 * @apiDescription Revokes a previously sent Strider invitation.
 * @apiName RevokeInvite
 * @apiGroup Admin
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} CURL Example:
 *    curl -X POST -d invite_code=xoxox http://localhost/invite/revoke
 *
 * @apiParam (RequestBody) {String} invite_code The invite code/token of the invite
 * being revoked.
 */
router.route('/invite/revoke').post(function(req, res) {
  var inviteCode = requireBody('invite_code', req, res);

  InviteCode.remove(
    { code: inviteCode, consumed_timestamp: { $exists: false } },
    function(err) {
      if (err) {
        debug(err);
        return res.status(500).send('Error revoking invite');
      }

      email.revokeInvite(inviteCode);
      res.redirect('/admin/invites');
    }
  );
});

module.exports = router;
