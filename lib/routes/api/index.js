/*
 * routes/api/index.js
 */

var BASE_PATH = '../../lib/';

var email = require(BASE_PATH + 'email')
  , InviteCode = require(BASE_PATH + 'models').InviteCode

module.exports = {
  config: require('./config'),
  require_param: require_param,
  invite_new: invite_new
}


/*
 * Require a request parameter is present or return a 400 response.
 */
function require_param(key, req, res) {
  var val = req.param(key);
  if (val === undefined) {
    res.statusCode = 400;
    var r = {
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

function invite_new(req, res) {
  var invite_code, email_addr;
  invite_code = require_param("invite_code", req, res);
  email_addr = require_param("email", req, res);
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
}

