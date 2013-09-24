/*
 * Backchannel server allows workers to stream messages back to the Node server
 * in a line-buffered way. Uses SSL.
 */

var _ = require('underscore')
 , Job = require('./models').Job
 , User = require('./models').User
 , async = require('async')
 , jobs = require('./jobs')
 , common = require('./common')
 , config = require('./config')
 , crypto = require('crypto')
 , email = require('./email')
 , filter = require('./ansi')
 , fs = require('fs')
 , logging = require('./logging')
 , qs = require('querystring')
 , request = require('request')
 , websockets = require('./websockets')

/*
 * send_email()
 *
 * Send email notifications upon job completion.
 *
 * <repo_config> - Repository config object.
 * <job> - Job object.
 */
function send_email(repo_config, job) {
  if (parseInt(job.test_exitcode, 10) === 0) {
    email.send_test_ok(job, repo_config)
  } else {
    email.send_test_fail(job, repo_config)
  }
}

exports.init = function() {

  // which users can access which projects?
  var ui_users = {}

  common.emitter.on('job.new', function(job) {
    var query = {}
    query[job.project.name] = {$gt: 0}
    User.find({ projects: query }, function (err, users) {
      if (err) return console.error('new job: Failed to query for users')
      if (!users) return console.error('new job: no users found')
      ui_users[job.project.name] = []
      for (var i=0; i<users.length; i++) {
        ui_users[job.project.name].push(users[i]._id)
      }
      // console.log('new job', msg, data);
      websockets.send(ui_users[job.project.name], 'job.new', job)
    })
  });

  common.emitter.on('browser.update', function (project, event, args) {
    websockets.send(ui_users[project], event, args)
  })

  common.emitter.on('job.done', function (data) {
    Job.findById(data.id, function (err, job) {
      if (err) return console.error('Error finding job', err.message)
      if (!job) return console.error('job.done but job not found:', data.id)
      _.extend(job, data)
      job.duration = data.finished.getTime() - data.started.getTime()
      websockets.send(ui_users[job.project], 'done', job.toJSON())
      job.save()
      // Send email if email notifications are not turned off for this repository.
      if (repo_config.email_notifications !== false) {
        send_email(repo_config, job)
      }
    })
  })
}
