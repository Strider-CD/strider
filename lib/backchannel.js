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
  , utils = require('./utils')
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

/*
function deepExtend(one, two) {
  if ('object' !== typeof one ||
      Array.isArray(one) ||
      'object' !== typeof two ||
      Array.isArray(two)) {
    return
  }
  for (var name in two) {
    if ('object' === typeof one[name] &&
        'object' === typeof two[name] &&
        !Array.isArray(one[name]) &&
        !Array.isArray(two[name])) {
      deepExtend(one[name], two[name])
    } else {
      one[name] = two[name]
    }
  }
}

function mergeConfigs(branch, config) {
  var base = _.extend({}, branch, config)
    , plugins = {}
    , plugin
  for (var i=0; i<branch.plugins.length; i++) {
    plugins[branch.plugins[i].id] = branch.plugins[i].config
  }
  base.plugins = []
  for (var i=0; i<config.plugins.length; i++) {
    if (!plugins[config.plugins[i].id]) {
      base.plugins.push(config.plugins[i])
      continue
    }
    deepExtend(plugins[config.plugins[i].id], config.plugins[i].config)
    base.plugins.push(plugins[config.plugins[i].id])
  }
  if (branch.runner &&
      config.runner &&
      branch.runner.id === config.runner.id) {
    deepExtend(branch.runner.config, config.runner.config)
    base.runner = branch.runner
  }
  return base
}
*/

function striderJson(provider, project, ref, done) {
  provider.getFile(
    '.strider.json',
    ref,
    project.creator.providers[project.provider.id],
    project.provider.config,
    project,
    function (err, contents) {
      if (err || !contents) return done({})
      var data = {}
      try {
        data = JSON.parse(contents)
      } catch (e) {
        console.warn('Strider config is invalid JSON for', project, ref)
        console.log(contents)
      }
      done(data)
    })
}

// Prepare the job for execution, save to database, and fire off a `job.new` event.
//
// job is expected to be populated with:
// - a trigger
// - a ref
// - the project name
// - the user id (if applicable)
// - type
// - created timestamp
// XXX: should this function go in a different file? idk. We'll
//      definitely move it around when we make strider OO.
function prepareJob(job) {
  console.log(job.project)
  Project.findOne({name: job.project}).populate('creator').lean().exec(function (err, project) {
    if (err || !project) return console.error('job.prepare - failed to get project', job.project, err)
    // ok so the project is real, we can go ahead and save this job
    console.log(project, project.provider)
    var provider = common.extensions.runner[project.provider.id]
    if (!provider) return console.error('job.prepare - provider not found for project', job.project, project.provider.id)
    Job.create(job, function (err, mjob) {
      if (err) return console.error('job.prepare - failed to save job', job, err)
      mjob = mjob.toJSON()
      mjob.project = project
      striderJson(provider, project, job.ref, function (config) {
        var branch = project.branches[job.ref.branch || 'master']
        config = _.extend({}, ('string' === typeof branch) ? project.branches[branch] : branch, config)
        common.emitter.emit('job.new', mjob, config)
      })
    })
  })
}

exports.init = function() {

  common.emitter.on('job.prepare', prepareJob)

  // which users can access which projects?
  var ui_users = {}
    , public_projects = {}

  common.emitter.on('job.new', function(job) {
    User.collaborators(job.project.name, 0, function (err, users) {
      if (err) return console.error('new job: Failed to query for users')
      if (!users) return console.error('new job: no users found')
      public_projects[job.project.name] = job.project.public
      ui_users[job.project.name] = []
      for (var i=0; i<users.length; i++) {
        ui_users[job.project.name].push(users[i]._id)
      }
      var njob = utils.sanitizeJob(job)
      njob.project = utils.sanitizeProject(job.project)
      websockets.send(ui_users[job.project.name], 'job.new', njob)
      if (job.project.public) {
        websockets.sendPublic(ui_users[job.project.name], 'job.new', njob, true)
      }
    })
  });

  common.emitter.on('browser.update', function (project, event, args) {
    websockets.send(ui_users[project], event, args)
    if (public_projects[project]) {
      websockets.sendPublic(ui_users[project], event, args, true)
    }
  })

  common.emitter.on('job.done', function (data) {
    Job.findById(data.id, function (err, job) {
      if (err) return console.error('Error finding job', err.message)
      if (!job) return console.error('job.done but job not found:', data.id)
      _.extend(job, data)
      job.duration = data.finished.getTime() - data.started.getTime()
      job.markModified('phases')
      job.markModified('plugin_data')
      job.save()
      job = job.toJSON()
      // TODO break off into a plugin
      Project.find({name: job.project}).lean().exec(function (err, project) {
        if (err) return console.error('Error finding project for job', err.message, job.project)
        if (!project) return console.error('Project for job.done not found', job.project)
        // Send email if email notifications are not turned off for this project.
        if (project.email_notifications !== false) {
          send_email(project, job)
        }
        job.project = utils.sanitizeProject(project)
        var njob = utils.sanitizeJob(job)
        njob.project = job.project
        websockets.send(ui_users[job.project], 'job.done', job)
        if (njob.project.public) {
          websockets.sendPublic(ui_users[job.project], 'job.done', njob, true)
        }
      })
    })
  })
}
