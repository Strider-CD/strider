'use strict';

var striderMailer = require('strider-mailer');
var pug = require('pug');
var fs = require('fs');
var path = require('path');
var config = require('./config');

var mailer = striderMailer(config);
var templateBasePath = path.join(__dirname, 'views/email_templates');
var templates = [
  'invite',
  'revoke_invite',
  'notify_password_change',
  'send_password_reset',
  'notify_email_change',
  'collaborator_invite_new_user',
  'collaborator_invite_existing_user'
];
var html = loadTemplates(templates, 'html');
var text = loadTemplates(templates, 'plaintext');

/*
 * loading all of the email templates at server start
 */

function loadTemplates(list, type) {
  if (!list) {
    return;
  }

  var result = {};

  type = type || 'plaintext';

  list.forEach(function (name) {
    var templatePath = path.join(templateBasePath, type, `${name}.pug`);
    result[name] = renderPug(templatePath);
  });

  return result;
}

function renderPug(filepath) {
  return pug.compile(fs.readFileSync(filepath, 'utf8'), { filename: filepath });
}

exports.sendInvite = function (code, email) {
  var subject = 'Strider Invitation';
  var bodyHtml = html.invite({code: code, strider_server_name: config.server_name});
  var bodyText = text.invite({code: code, strider_server_name: config.server_name});

  mailer.send(email, subject, bodyText, bodyHtml);
};

exports.revokeInvite = function (code, email) {
  var subject = 'Strider Invitation';
  var bodyHtml = html.revoke_invite({code: code, strider_server_name: config.server_name});
  var bodyText = text.revoke_invite({code: code, strider_server_name: config.server_name});

  mailer.send(email, subject, bodyText, bodyHtml);
};

exports.notifyPasswordChange = function (user) {
  var currentTime = new Date();
  var subject = `[STRIDER] - Password Change Notification - ${currentTime.getHours()}:${currentTime.getMinutes()}`;
  var bodyText = text.notify_password_change();
  var bodyHtml = html.notify_password_change();
  var to = user.email;

  mailer.send(to, subject, bodyText, bodyHtml);
};

exports.sendPasswordReset = function (user) {
  var currentTime = new Date();
  var templateOptions = {
    token: user.resetPasswordToken,
    strider_server_name: config.server_name
  };
  var subject = `[STRIDER] - Password Reset - ${currentTime.getHours()}:${currentTime.getMinutes()}`;
  var bodyText = text.send_password_reset(templateOptions);
  var bodyHtml = html.send_password_reset(templateOptions);
  var to = user.email;

  mailer.send(to, subject, bodyText, bodyHtml);
};

exports.notifyEmailChange = function (user, oldEmail) {
  var currentTime = new Date();
  var subject = `[STRIDER] - Email Address Change Notification - ${currentTime.getHours()}:${currentTime.getMinutes()}`;
  var to = user.email;
  var bodyText = text.notify_email_change({ old_email: oldEmail, user: user });
  var bodyHtml = html.notify_email_change({ old_email: oldEmail, user: user });

  mailer.send(to, subject, bodyText, bodyHtml);
  mailer.send(oldEmail, subject, bodyText, bodyHtml);

  console.log(`send email change notification to ${oldEmail} and ${to}`);
};

exports.sendInviteCollaboratorNewUser = function (inviter, email, code, url) {
  // not actually properly capitalized right now
  var displayName = url.replace(/^.*com\//gi, '');
  var subject = `[STRIDER] Invite to ${displayName}`;
  var to = email;
  var pugVariables = {
    inviter: inviter.email,
    display_name: displayName,
    code: code,
    strider_server_name: config.server_name
  };

  var bodyText = text.collaborator_invite_new_user(pugVariables);
  var bodyHtml = html.collaborator_invite_new_user(pugVariables);

  mailer.send(to, subject, bodyText, bodyHtml);

  console.log(`send collaborator invite to new user ${email} for ${displayName}`);
};


exports.sendInviteCollaboratorExistingUser = function (req, email, url) {
  // not actually properly capitalized right now
  var displayName = url.replace(/^.*com\//gi, '');
  var subject = `[STRIDER] Invite to ${displayName}`;
  var to = email;
  var pugVariables = {
    inviter: req.user.email,
    display_name: displayName,
    strider_server_name: config.server_name
  };
  var bodyText = text.collaborator_invite_existing_user(pugVariables);
  var bodyHtml = html.collaborator_invite_existing_user(pugVariables);

  mailer.send(to, subject, bodyText, bodyHtml);

  console.log(`send collaborator invite to existing user ${email} for ${displayName}`);
};

exports.notifyNewAdmin = function (user, email) {
  var currentTime = new Date();
  var subject = `[STRIDER] - New Admin  - ${user} - ${currentTime.getHours()}:${currentTime.getMinutes()}`;
  var body = `Hello Core,\n\nYou have a new admin colleague: ${user}\n\nHopefully this isn't unexpected.\n\nRegards,\n - StriderCD.com\n   Brilliant Continuous Delivery`;

  mailer.send(email, subject, body, body);
  console.log(`Sending admin notification for new admin ${user}`);
};
