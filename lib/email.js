var _ = require('underscore')
  , config = require('./config')
  , moment = require('moment')
  , logging = require('./logging')
  , jade = require('jade')
  , fs = require('fs')
  , path = require('path')
  , User = require('./models').User
  , mailer = require('strider-mailer')(config)
  ;

/*
 * loading all of the email templates at server start
 */

function renderJade(filepath) {
  return jade.compile(fs.readFileSync(filepath, 'utf8'),{filename: filepath });
}

function renderUnderscore(filepath) {
  return _.template(fs.readFileSync(filepath, 'utf8'));
}

// TODO refactor

var invite_plaintext = renderJade(
            path.join(__dirname, '../views', 'email_templates', 'plaintext', 'invite.jade'));

var invite_html = renderJade(
            path.join(__dirname, '../views', 'email_templates', 'html','invite.jade'));

var notify_password_change_html = renderJade(
            path.join(__dirname, '../views', 'email_templates', 'html','notify_password_change.jade'));

var notify_password_change_plaintext = renderJade(
            path.join(__dirname, '../views', 'email_templates', 'plaintext','notify_password_change.jade'));

var notify_email_change_html = renderJade(
            path.join(__dirname, '../views', 'email_templates', 'html','notify_email_change.jade'));

var notify_email_change_plaintext = renderJade(
            path.join(__dirname, '../views', 'email_templates', 'plaintext','notify_email_change.jade'));

var collaborator_invite_new_html = renderJade(
            path.join(__dirname, '../views', 'email_templates', 'html','collaborator_invite_new_user.jade'));

var collaborator_invite_new_plaintext = renderJade(
            path.join(__dirname, '../views', 'email_templates', 'plaintext','collaborator_invite_new_user.jade'));

var collaborator_invite_existing_html = renderJade(
            path.join(__dirname, '../views', 'email_templates', 'html','collaborator_invite_existing_user.jade'));

var collaborator_invite_existing_plaintext = renderJade(
            path.join(__dirname, '../views', 'email_templates', 'plaintext','collaborator_invite_existing_user.jade'));

exports.send_invite = function(code, email) {
    var subject = "Strider Invitation";

    var body_html = invite_html({ code:code, strider_server_name:config.server_name });
    var body_text = invite_plaintext({ code:code, strider_server_name:config.server_name });
    var to = email;

    mailer.send(to, subject, body_text, body_html);
}

exports.notify_password_change = function (user) {
  var current_time = new Date();
  var subject = "[STRIDER] - Password Change Notification - " +
                current_time.getHours() +
                ":" + current_time.getMinutes();
  var body_text = notify_password_change_plaintext();
  var body_html = notify_password_change_html();
  var to = user.email;

  mailer.send(to, subject, body_text,body_html);
}

exports.notify_email_change = function (user, old_email) {

  var current_time = new Date();
  var subject = "[STRIDER] - Email Address Change Notification - " + current_time.getHours() + ":" + current_time.getMinutes() ;

  var to = user.email;

  var body_text = notify_email_change_plaintext({old_email: old_email, user: user});
  var body_html = notify_email_change_html({old_email: old_email, user: user});

  mailer.send(to, subject, body_text,body_html);
  mailer.send(old_email,subject,body_text,body_html);

  console.log("send email change notification to " + old_email + " and " + to);
}

exports.send_invite_collaborator_new_user = function(inviter, email, code, url) {

  // not actually properly capitalized right now
  var display_name = url.replace(/^.*com\//gi, '');

  var subject = "[STRIDER] Invite to " + display_name;
  var to = email;

  var jade_variables = {
    inviter: inviter.email,
    display_name: display_name,
    code: code,
    strider_server_name: config.server_name
  };

  var body_text = collaborator_invite_new_plaintext(jade_variables);
  var body_html = collaborator_invite_new_html(jade_variables);

  mailer.send(to,subject,body_text,body_html);

  console.log("send collaborator invite to new user " + email + " for " +  display_name);
}


exports.send_invite_collaborator_existing_user = function(req, email, url) {

  // not actually properly capitalized right now
  var display_name = url.replace(/^.*com\//gi, '');

  var subject = "[STRIDER] Invite to " + display_name;
  var to = email;

  var jade_variables = {
    inviter: req.user.email,
    display_name: display_name,
    strider_server_name: config.server_name
  };

  var body_text = collaborator_invite_existing_plaintext(jade_variables);
  var body_html = collaborator_invite_existing_html(jade_variables);

  mailer.send(to,subject,body_text,body_html);

  console.log("send collaborator invite to existing user " + email + " for " +  display_name);
}

exports.notify_new_admin = function (user) {

  var current_time = new Date();
  var subject = "[STRIDER] - New Admin  - " + user + " - " + current_time.getHours() + ":" + current_time.getMinutes() ;
  var body_template = "Hello Core,\n\n" +
    "You have a new admin colleague: " + user + "\n\n" +
    "Hopefully this isn't unexpected.\n\n" +
    "Regards,\n" +
    " - StriderCD.com\n" +
    "   Brilliant Continuous Delivery";

    var body = body_template;

    var to = "core@beyondfog.com";
    mailer.send(to, subject, body, body);
    console.log("Sending admin notification for new admin " + user);
}
