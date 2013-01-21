/*
 * routes/api/index.js
 */

var BASE_PATH = '../../lib/';

var _ = require('underscore')
  , crypto = require('crypto')
  , check = require('validator').check
  , Step = require('step')
  , humane = require(BASE_PATH + 'humane')
  , email = require(BASE_PATH + 'email')
  , gh = require(BASE_PATH + 'github')
  , heroku = require(BASE_PATH + 'heroku')
  , logging = require(BASE_PATH + 'logging')
  , InviteCode = require(BASE_PATH + 'models').InviteCode
;


/*
 * Require a request parameter is present or return a 400 response.
 */
var require_param = exports.require_param = function(key, req, res) {
  var val = req.param(key);
  if (val === undefined) {
    res.statusCode = 400;
    r = {
      status: "error",
      errors: ["you must supply parameter " + key]
    };
    return res.end(JSON.stringify(r), null, '\t');
  }
  return val;
}


/*
 * POST /api/invite/new
 *
 * Create & email a new Strider invite. Only core@beyondfog.com may use this.
 *
 * <invite_code> - Invite token string to set.
 * <email> - Email to send to.
 *
 */

exports.invite_new = function(req, res)
{
  var invite_code, email_addr;
  invite_code = require_param("invite_code", req, res);
  email_addr = require_param("email", req, res);
  if (invite_code === undefined
    || email_addr === undefined) {
    return;
  }

  var invite = new InviteCode();
  invite.code = invite_code;
  invite.created_timestamp = new Date();
  invite.emailed_to = email_addr;

  invite.save(function(err, invite) {
    email.send_invite(invite.code, email_addr);
    res.writeHead(302, {
      'Location': '/admin/invites'
    });
    res.end();
  });
}

