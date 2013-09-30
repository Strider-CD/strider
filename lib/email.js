var _ = require('underscore')
  , config = require('./config')
  , everypaas = require('everypaas')
  , nodemailer = require("nodemailer")
  , moment = require('moment')
  , logging = require('./logging')
  , jade = require('jade')
  , fs = require('fs')
  , path = require('path')
  , User = require('./models').User
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

var test_fail_plaintext = renderJade(
            path.join(__dirname, '../views', 'email_templates', 'plaintext','test_fail.jade'));

var test_succeed_plaintext = renderJade(
            path.join(__dirname, '../views', 'email_templates', 'plaintext','test_succeed.jade'));

var test_succeed_html = renderUnderscore(
            path.join(__dirname, '../views', 'email_templates', 'html','test_succeed.html'));

var test_fail_html = renderUnderscore(
            path.join(__dirname, '../views', 'email_templates', 'html','test_fail.html'));

var collaborator_invite_new_html = renderJade(
            path.join(__dirname, '../views', 'email_templates', 'html','collaborator_invite_new_user.jade'));

var collaborator_invite_new_plaintext = renderJade(
            path.join(__dirname, '../views', 'email_templates', 'plaintext','collaborator_invite_new_user.jade'));

var collaborator_invite_existing_html = renderJade(
            path.join(__dirname, '../views', 'email_templates', 'html','collaborator_invite_existing_user.jade'));

var collaborator_invite_existing_plaintext = renderJade(
            path.join(__dirname, '../views', 'email_templates', 'plaintext','collaborator_invite_existing_user.jade'));

/*
 * opening smtp connection
 */
// Default to printing a warning
var smtpTransport = {
  sendMail: function(opts, cb) {
    console.log("WARNING: no SMTP transport detected nor configured. Cannot send email.");
    cb(null, {message:null});
  }
};

// Try using SendGrid / Mailgun
if (everypaas.getSMTP() !== null) {
  console.log("Using SMTP transport: %j", everypaas.getSMTP());
  smtpTransport = nodemailer.createTransport.apply(null, everypaas.getSMTP());
} else {
  if (config.sendgrid) {
    console.log("Using Sendgrid transport from config ");
    smtpTransport = nodemailer.createTransport("SMTP",{
      service: "SendGrid",
      auth: {
          user: config.sendgrid.username,
          pass: config.sendgrid.password
      }
    });
  } else if (config.smtp) {
    console.log("Using SMTP transport from config");
    smtpTransport = nodemailer.createTransport("SMTP",{
      host:config.smtp.host,
      port:parseInt(config.smtp.port),
      auth: {
          user: config.smtp.auth.user,
          pass: config.smtp.auth.pass
      }
    });
  }
}

var send = exports.send = function(to, subject, text_body, html_body, from) {
  from = from || config.smtp ? config.smtp.from : null

  var mailOptions = {
    from: from, // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text_body, // plaintext body_template
    html: html_body // html body
  }
  // send mail with defined transport object
  smtpTransport.sendMail(mailOptions, function(error, response){
      if(error){
          console.log("Error sending email:",error);
      }
    });

}

var elapsed_time = exports.elapsed_time = function(start,finish) {
  var in_seconds = (finish - start) / 1000;
  if (in_seconds>60)
  {
    return (Math.floor(in_seconds / 60) + "m " + Math.round(in_seconds % 60) + "s");
  } else {
    return (Math.round(in_seconds) + "s");
  }
}

exports.send_test_ok = function(job, project, to) {
  var display_name = project.name
  var subject = "[STRIDER] - " + display_name + " test success - " + job._id.toString().substr(0,8);
  var duration = elapsed_time(job.started.getTime(),job.finished.getTime());
  var url = config.strider_server_name + "/" + display_name + "/job/" + job._id;

  var body_html;

  body_html = test_succeed_html(
    { display_name:display_name,
      finish_time:moment(job.finished_timestamp).format('YYYY-MM-DD h:mm a'),
      elapsed_time:duration,
      url:url,
      subject:subject,
      log_tail:format_stdmerged(job.std.merged, "html")
    }
  );

  var body_text = test_succeed_plaintext(
    { display_name:display_name,
      finish_time:job.finished,
      elapsed_time:duration,
      url:url,
      log_tail:format_stdmerged(job.std.merged, "plaintext")
    }
  );

  User.collaborators(project.name, function (err, users) {
    for (var i=0; i<users.length; i++) {
      send(users[i].email, subject, body_text, body_html)
    }
  })
}

exports.send_test_fail = function(job, project, to)
{
    var display_name = project.name
    var subject = "[STRIDER] - " + display_name + " test failure - " + job._id.toString().substr(0,8);

    var duration = elapsed_time(job.created.getTime(),job.finished.getTime());
    var url = config.strider_server_name + "/" + display_name + "/job/" + job._id;
    console.debug("test url for email: " + url);

    var body_html;

    body_html = test_fail_html(
      { display_name:display_name,
        finish_time:moment(job.finished).format('YYYY-MM-DD h:mm a'),
        elapsed_time:duration,
        url:url,
        subject:subject,
        log_tail:format_stdmerged(job.std.merged, "html")
      }
    );


    var body_text = test_fail_plaintext(
      { display_name:display_name,
        finish_time:job.finished,
        elapsed_time:duration,
        url:url,
        log_tail:format_stdmerged(job.std.merged, "plaintext")
      }
    );

  User.collaborators(project.name, function (err, users) {
    for (var i=0; i<users.length; i++) {
      send(users[i].email, subject, body_text, body_html)
    }
  })
}


/*
 * format_stdmerged()
 *
 * Format the stdmerged property (test std stream output) for sendgrid consumption.
 * <stdmerged> - Job's stdmerged property.
 */
var format_stdmerged = exports.format_stdmerged = function (stdmerged,email_format)
{
  // 4k
  var start = stdmerged.length - 1 - 4096;
  if (start < 0) {
    start = 0;
  }
  var tlog = stdmerged.slice(start, stdmerged.length - 1).replace(/^\s+|\s+$/g,"");
  // Start each line with a space

  var tlines = tlog.split('\n');

  var b = new Buffer(8192);
  var offset = 0;
  _.each(tlines, function(l) {
    var towrite
    if (email_format === 'plaintext') {
      towrite = " " + l.replace(/\[(\d;)?\d*m/gi,'') + "\n";
    } else {
      towrite = " " + l.replace(/\[(\d;)?\d*m/gi,'') + "<br>\n";
    }

    b.write(towrite, offset, towrite.length);
    offset += towrite.length;
  });

  return b.toString('utf8', 0, offset);
}


exports.send_invite = function(code, email) {
    var subject = "Strider Invitation";

    var body_html = invite_html({ code:code, strider_server_name:config.strider_server_name });
    var body_text = invite_plaintext({ code:code, strider_server_name:config.strider_server_name });
    var to = email;

    send(to, subject, body_text, body_html);
}

exports.notify_password_change = function (user) {
  var current_time = new Date();
  var subject = "[STRIDER] - Password Change Notification - " +
                current_time.getHours() +
                ":" + current_time.getMinutes();
  var body_text = notify_password_change_plaintext();
  var body_html = notify_password_change_html();
  var to = user.email;

  send(to, subject, body_text,body_html);
}

exports.notify_email_change = function (user, old_email) {

  var current_time = new Date();
  var subject = "[STRIDER] - Email Address Change Notification - " + current_time.getHours() + ":" + current_time.getMinutes() ;

  var to = user.email;

  var body_text = notify_email_change_plaintext({old_email: old_email, user: user});
  var body_html = notify_email_change_html({old_email: old_email, user: user});

  send(to, subject, body_text,body_html);
  send(old_email,subject,body_text,body_html);

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
    strider_server_name: config.strider_server_name
  };

  var body_text = collaborator_invite_new_plaintext(jade_variables);
  var body_html = collaborator_invite_new_html(jade_variables);

  send(to,subject,body_text,body_html);

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
    strider_server_name: config.strider_server_name
  };

  var body_text = collaborator_invite_existing_plaintext(jade_variables);
  var body_html = collaborator_invite_existing_html(jade_variables);

  send(to,subject,body_text,body_html);

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
    send(to, subject, body, body);
    console.log("Sending admin notification for new admin " + user);
}
