/*
 * Backchannel server allows workers to stream messages back to the Node server
 * in a line-buffered way. Uses SSL.
 */

var _ = require('underscore')
  , async = require('async')
  , qs = require('querystring')
  , request = require('request')

  , fs = require('fs')

  , jobs = require('./jobs')
  , crypto = require('crypto')
  , email = require('./email')
  , filter = require('./ansi')
  , common = require('./common')
  , config = require('./config')
  , logging = require('./logging')
  , websockets = require('./websockets')

  , models = require('./models')
  , Job = models.Job
  , User = models.User
  , Project = models.Project

/*
 * send_email()
 *
 * Send email notifications upon job completion.
 *
 * <project> - Project model.
 * <job> - Job object.
 */
function send_email(project, job) {
  if (parseInt(job.test_exitcode, 10) === 0) {
    email.send_test_ok(job, project)
  } else {
    email.send_test_fail(job, project)
  }
}

exports.init = function() {

  // which users can access which projects?
  var ui_users = {}

  common.emitter.on('job.new', function(job) {
    User.collaborators(job.project.name, 0, function (err, users) {
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
      // TODO break off into a plugin
      Project.find({name: job.project}, function (err, project) {
        if (err) return console.error('Error finding project for job', err.message, job.project)
        if (!project) return console.error('Project for job.done not found', job.project)
        // Send email if email notifications are not turned off for this project.
        if (project.email_notifications !== false) {
          send_email(project, job)
        }
      })
    })
  })
}
