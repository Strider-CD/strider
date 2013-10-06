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

  , models = require('./models')
  , Job = models.Job
  , User = models.User
  , Project = models.Project

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
  function finished(err, contents) {
    if (err || !contents) return done({})
    var data = {}
    try {
      data = JSON.parse(contents)
    } catch (e) {
      console.warn('Strider config is invalid JSON for', project, ref)
      console.log(contents)
    }
    done(data)
  }
  if (!provider.hosted) {
    return provider.getFile('strider.json', ref, project.provider.config, project, finished)
  }
  var account = project.creator.account(project.provider.id, project.provider.account)
  provider.getFile('strider.json', ref, account, project.provider.config, project, finished)
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
function prepareJob(emitter, job) {
  console.log('preparing')
  Project.findOne({name: job.project}).populate('creator').exec(function (err, project) {
    if (err || !project) return console.error('job.prepare - failed to get project', job.project, err)
    // ok so the project is real, we can go ahead and save this job
    var provider = common.extensions.provider[project.provider.id]
    if (!provider) {
      return console.error('job.prepare - provider not found for project', job.project, project.provider.id)
    }
    Job.create(job, function (err, mjob) {
      if (err) return console.error('job.prepare - failed to save job', job, err)
      console.log('created')
      var jjob = mjob.toJSON()
      jjob.project = project
      striderJson(provider, project, job.ref, function (config) {
        console.log('striderjson')
        var branch = project.branch(job.ref.branch || 'master')
        if (!branch) return console.error('[job.prepare] branch not found', job.ref.branch || 'master', project.name)
        config = _.extend({}, branch.mirror_master ? project.branch('master') : branch, config)
        emitter.emit('job.new', jjob, config)
        if (!mjob.runner) mjob.runner = {}
        mjob.runner.id = config.runner.id
        mjob.save()
      })
    })
  })
}

function BackChannel(emitter, ws) {
  this.users = {}
  this.public = {}
  this.waiting = {}
  this.ws = ws
  emitter.on('job.prepare', prepareJob.bind(null, emitter))
  emitter.on('job.new', this.newJob.bind(this));
  emitter.on('browser.update', this.onUpdate.bind(this))
  emitter.on('job.done', this.jobDone.bind(this))

}

BackChannel.prototype = {

  send: function (project, event, args) {
    if (this.users[project]) {
      this.ws.send(this.users[project], [event, args, 'yours'])
    }
    if (this.public[project]) {
      this.ws.sendPublic(this.users[project], [event, args, 'public'])
    }
    // TODO: also send to system admins
  },
  newJob: function (job) {
    console.log('newjob')
    var name = job.project.name
      , self = this
    this.waiting[name] = []
    this.public[name] = job.project.public
    User.collaborators(name, 0, function (err, users) {
      console.log('users', users.length)
      if (err) return console.error('new job: Failed to query for users')
      if (!users) return console.error('new job: no users found')
      self.users[name] = []
      var i
      for (i=0; i<users.length; i++) {
        self.users[name].push(users[i]._id.toString())
      }
      var njob = utils.sanitizeJob(job)
      njob.project = utils.sanitizeProject(job.project)
      self.send(name, 'job.new', [njob])
      // TODO: also send to system admins
      for (i=0; i<self.waiting[name].length; i++) {
        self.send.apply(self, [name].concat(self.waiting[name][i]))
      }
      delete self.waiting[name]
    })
  },
  // [project name, event name, [list of arguments]]
  onUpdate: function (project, event, args) {
    if (this.waiting[project]) {
      return this.waiting[project].push([event, args])
    }
    this.send(project, event, args)
    if (event === 'job.status.started') {
      Job.findById(args[0], function (err, job) {
        if (err) return console.error('[backchannel][job.status.started] error getting job', args[0], err)
        if (!job) return console.error('[backchannel][job.status.started] job not found', args[0])
        job.started = args[1]
        job.save()
      })
    }
  },
  jobDone: function (data) {
    var self = this
    Job.findById(data.id, function (err, job) {
      if (err) return console.error('Error finding job', err.message)
      if (!job) return console.error('job.done but job not found:', data.id)
      _.extend(job, data)
      job.duration = data.finished.getTime() - data.started.getTime()
      job.markModified('phases')
      job.markModified('plugin_data')
      job.test_exitcode = job.phases.test && job.phases.test.exitCode
      job.deploy_exitcode = job.phases.deploy && job.phases.deploy.exitCode
      job.save()
      job = job.toJSON()
      // TODO break off into a plugin
      Project.findOne({name: job.project}).lean().exec(function (err, project) {
        if (err) return console.error('Error finding project for job', err.message, job.project)
        if (!project) return console.error('Project for job.done not found', job.project)
        // Send email if email notifications are not turned off for this project.
        job.project = utils.sanitizeProject(project)
        job.status = utils.status(job)
        self.send(project.name, 'job.done', [job])
        if (project.email_notifications !== false) {
          User.findById(job.user_id).lean().exec(function (err, user) {
            if (err) return console.error('[job.done][backchannel] trying to send email, no user found', job.user_id, job._id)
            send_email(project, job, user.email)
          })
        }
      })
    })
  }
}

module.exports = BackChannel

/*
 * send_email()
 *
 * Send email notifications upon job completion.
 *
 * <project> - Project model.
 * <job> - Job object.
 */
function send_email(project, job, user_email) {
  if (parseInt(job.test_exitcode, 10) === 0) {
    email.send_test_ok(job, project, user_email)
  } else {
    email.send_test_fail(job, project, user_email)
  }
}
