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
  return pug.compile(fs.readFileSync(filepath, 'utf8'), {filename: filepath});
}

exports.send_invite = function (code, email) {
  var subject = 'Strider Invitation';
  var body_html = html.invite({code: code, strider_server_name: config.server_name});
  var body_text = text.invite({code: code, strider_server_name: config.server_name});

  mailer.send(email, subject, body_text, body_html);
};

exports.revoke_invite = function (code, email) {
  var subject = 'Strider Invitation';
  var body_html = html.revoke_invite({code: code, strider_server_name: config.server_name});
  var body_text = text.revoke_invite({code: code, strider_server_name: config.server_name});

  mailer.send(email, subject, body_text, body_html);
};

exports.notify_password_change = function (user) {
  var current_time = new Date();
  var subject = `[STRIDER] - Password Change Notification - ${current_time.getHours()}:${current_time.getMinutes()}`;
  var body_text = text.notify_password_change();
  var body_html = html.notify_password_change();
  var to = user.email;

  mailer.send(to, subject, body_text, body_html);
};

exports.send_password_reset = function (user) {
  var current_time = new Date();
  var template_options = {
    token: user.resetPasswordToken,
    strider_server_name: config.server_name
  };
  var subject = `[STRIDER] - Password Reset - ${current_time.getHours()}:${current_time.getMinutes()}`;
  var body_text = text.send_password_reset(template_options);
  var body_html = html.send_password_reset(template_options);
  var to = user.email;

  mailer.send(to, subject, body_text, body_html);
};

exports.notify_email_change = function (user, old_email) {
  var current_time = new Date();
  var subject = `[STRIDER] - Email Address Change Notification - ${current_time.getHours()}:${current_time.getMinutes()}`;

  var to = user.email;

  var body_text = text.notify_email_change({old_email: old_email, user: user});
  var body_html = html.notify_email_change({old_email: old_email, user: user});

  mailer.send(to, subject, body_text, body_html);
  mailer.send(old_email, subject, body_text, body_html);

  console.log(`send email change notification to ${old_email} and ${to}`);
};

exports.send_invite_collaborator_new_user = function (inviter, email, code, url) {
  // not actually properly capitalized right now
  var display_name = url.replace(/^.*com\//gi, '');

  var subject = `[STRIDER] Invite to ${display_name}`;
  var to = email;

  var pug_variables = {
    inviter: inviter.email,
    display_name: display_name,
    code: code,
    strider_server_name: config.server_name
  };

  var body_text = text.collaborator_invite_new_user(pug_variables);
  var body_html = html.collaborator_invite_new_user(pug_variables);

  mailer.send(to, subject, body_text, body_html);

  console.log(`send collaborator invite to new user ${email} for ${display_name}`);
};


exports.send_invite_collaborator_existing_user = function (req, email, url) {
  // not actually properly capitalized right now
  var display_name = url.replace(/^.*com\//gi, '');

  var subject = `[STRIDER] Invite to ${display_name}`;
  var to = email;

  var pug_variables = {
    inviter: req.user.email,
    display_name: display_name,
    strider_server_name: config.server_name
  };

  var body_text = text.collaborator_invite_existing_user(pug_variables);
  var body_html = html.collaborator_invite_existing_user(pug_variables);

  mailer.send(to, subject, body_text, body_html);

  console.log(`send collaborator invite to existing user ${email} for ${display_name}`);
};

exports.notify_new_admin = function (user, email) {
  var current_time = new Date();
  var subject = `[STRIDER] - New Admin  - ${user} - ${current_time.getHours()}:${current_time.getMinutes()}`;
  var body = `Hello Core,\n\nYou have a new admin colleague: ${user}\n\nHopefully this isn't unexpected.\n\nRegards,\n - StriderCD.com\n   Brilliant Continuous Delivery`;

  mailer.send(email, subject, body, body);
  console.log(`Sending admin notification for new admin ${user}`);
};
