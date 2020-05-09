const striderMailer = require('strider-mailer');
const pug = require('pug');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const mailer = striderMailer(config);
const templateBasePath = path.join(__dirname, 'views/email_templates');
const templates = [
  'invite',
  'revoke_invite',
  'notify_password_change',
  'send_password_reset',
  'notify_email_change',
  'collaborator_invite_new_user',
  'collaborator_invite_existing_user'
];
const html = loadTemplates(templates, 'html');
const text = loadTemplates(templates, 'plaintext');

/*
 * loading all of the email templates at server start
 */
function loadTemplates(list, type) {
  if (!list) {
    return;
  }

  const result = {};

  type = type || 'plaintext';

  list.forEach(function(name) {
    const templatePath = path.join(templateBasePath, type, `${name}.pug`);
    result[name] = renderPug(templatePath);
  });

  return result;
}

function renderPug(filepath) {
  return pug.compile(fs.readFileSync(filepath, 'utf8'), { filename: filepath });
}

exports.sendInvite = function(code, email) {
  const subject = 'Strider Invitation';
  const bodyHtml = html.invite({
    code: code,
    strider_server_name: config.server_name
  });
  const bodyText = text.invite({
    code: code,
    strider_server_name: config.server_name
  });

  mailer.send(email, subject, bodyText, bodyHtml);
};

exports.revokeInvite = function(code, email) {
  const subject = 'Strider Invitation';
  const bodyHtml = html.revoke_invite({
    code: code,
    strider_server_name: config.server_name
  });
  const bodyText = text.revoke_invite({
    code: code,
    strider_server_name: config.server_name
  });

  mailer.send(email, subject, bodyText, bodyHtml);
};

exports.notifyPasswordChange = function(user) {
  const currentTime = new Date();
  const subject = `[STRIDER] - Password Change Notification - ${currentTime.getHours()}:${currentTime.getMinutes()}`;
  const bodyText = text.notify_password_change();
  const bodyHtml = html.notify_password_change();
  const to = user.email;

  mailer.send(to, subject, bodyText, bodyHtml);
};

exports.sendPasswordReset = function(user) {
  const currentTime = new Date();
  const templateOptions = {
    token: user.resetPasswordToken,
    strider_server_name: config.server_name
  };
  const subject = `[STRIDER] - Password Reset - ${currentTime.getHours()}:${currentTime.getMinutes()}`;
  const bodyText = text.send_password_reset(templateOptions);
  const bodyHtml = html.send_password_reset(templateOptions);
  const to = user.email;

  mailer.send(to, subject, bodyText, bodyHtml);
};

exports.notifyEmailChange = function(user, oldEmail) {
  const currentTime = new Date();
  const subject = `[STRIDER] - Email Address Change Notification - ${currentTime.getHours()}:${currentTime.getMinutes()}`;
  const to = user.email;
  const bodyText = text.notify_email_change({ old_email: oldEmail, user: user });
  const bodyHtml = html.notify_email_change({ old_email: oldEmail, user: user });

  mailer.send(to, subject, bodyText, bodyHtml);
  mailer.send(oldEmail, subject, bodyText, bodyHtml);

  console.log(`send email change notification to ${oldEmail} and ${to}`);
};

exports.sendInviteCollaboratorNewUser = function(inviter, email, code, url) {
  // not actually properly capitalized right now
  const displayName = url.replace(/^.*com\//gi, '');
  const subject = `[STRIDER] Invite to ${displayName}`;
  const to = email;
  const pugVariables = {
    inviter: inviter.email,
    display_name: displayName,
    code: code,
    strider_server_name: config.server_name
  };

  const bodyText = text.collaborator_invite_new_user(pugVariables);
  const bodyHtml = html.collaborator_invite_new_user(pugVariables);

  mailer.send(to, subject, bodyText, bodyHtml);

  console.log(
    `send collaborator invite to new user ${email} for ${displayName}`
  );
};

exports.sendInviteCollaboratorExistingUser = function(req, email, url) {
  // not actually properly capitalized right now
  const displayName = url.replace(/^.*com\//gi, '');
  const subject = `[STRIDER] Invite to ${displayName}`;
  const to = email;
  const pugVariables = {
    inviter: req.user.email,
    display_name: displayName,
    strider_server_name: config.server_name
  };
  const bodyText = text.collaborator_invite_existing_user(pugVariables);
  const bodyHtml = html.collaborator_invite_existing_user(pugVariables);

  mailer.send(to, subject, bodyText, bodyHtml);

  console.log(
    `send collaborator invite to existing user ${email} for ${displayName}`
  );
};

exports.notifyNewAdmin = function(user, email) {
  const currentTime = new Date();
  const subject = `[STRIDER] - New Admin  - ${user} - ${currentTime.getHours()}:${currentTime.getMinutes()}`;
  const body = `Hello Core,\n\nYou have a new admin colleague: ${user}\n\nHopefully this isn't unexpected.\n\nRegards,\n - StriderCD.com\n   Brilliant Continuous Delivery`;

  mailer.send(email, subject, body, body);
  console.log(`Sending admin notification for new admin ${user}`);
};
