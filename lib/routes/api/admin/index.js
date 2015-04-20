'use strict';

var express = require('express');
var User = require('../../../models').User;
var auth = require('../../../auth');
var InviteCode = require('../../../models').InviteCode;
var email = require('../../../email');
var requireBody = require('../../../utils/require-body');
var router = express.Router();

router.use(auth.requireAdminOr401);

/*
 * GET /admin/users
 */
router.route('/users')
  .get(function(req, res) {
    var users = [];

    User.find({}).sort({ email: 1 }).exec(function(err, results) {
      results.forEach(function(user) {
        users.push({
          id: user.id,
          email: user.email
        });
      });

      res.json(users);
    });
  });

/*
 * GET /api/admin/jobs_status
 * Returns JSON object of last 100 jobs across entire system
 */
router.route('/jobs')
  .get(function(req, res) {
    res.send(500, 'Not yet implemented');
  });

/*
 * POST /api/invite/new
 *
 * Create & email a new Strider invite. Only core@beyondfog.com may use this.
 *
 * <invite_code> - Invite token string to set.
 * <email> - Email to send to.
 *
 */
router.route('/invite/new')
  .post(function (req, res) {
    var invite_code, email_addr;
    invite_code = requireBody('invite_code', req, res);
    email_addr = requireBody('email', req, res);
    if (invite_code === undefined ||
        email_addr === undefined) {
      return;
    }

    var invite = new InviteCode();
    invite.code = invite_code;
    invite.created_timestamp = new Date();
    invite.emailed_to = email_addr;

    invite.save(function(err, invite) {
      email.send_invite(invite.code, email_addr)
      res.redirect('/admin/invites')
    });
  });

router.route('/invite/revoke')
  .post(function (req, res) {
    var inviteCode = requireBody('invite_code', req, res);

    InviteCode.remove({ code: inviteCode, consumed_timestamp: { $exists: false } }, function (err) {
      if (err) {
        console.error(err);
        return res.send(500, 'Error revoking invite');
      }

      email.revoke_invite(inviteCode);
      res.redirect('/admin/invites');
    });
  });

module.exports = router;
