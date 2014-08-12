/*
 * Backchannel server allows workers to stream messages back to the Node server
 * in a line-buffered way. Uses SSL.
 */

var _ = require('lodash')
  , async = require('async')

  , jobs = require('./jobs')
  , common = require('./common')
  , utils = require('./utils')
  , config = require('./config')

  , models = require('./models')
  , Job = models.Job
  , User = models.User
  , Project = models.Project

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
  Project.findOne({name: job.project}).populate('creator').exec(function (err, project) {
    if (err || !project) return console.error('job.prepare - failed to get project', job.project, err)
    // ok so the project is real, we can go ahead and save this job
    var provider = common.extensions.provider[project.provider.id]
    if (!provider) {
      return console.error('job.prepare - provider not found for project', job.project, project.provider.id)
    }
    Job.create(job, function (err, mjob) {
      if (err) return console.error('job.prepare - failed to save job', job, err)
      var jjob = mjob.toJSON();
      jjob.project = project
      jjob.providerConfig = project.provider.config
      striderJson(provider, project, job.ref, function (config) {
        var branch = project.branch(job.ref.branch || 'master')
        if (!branch) return console.error('[job.prepare] branch not found', job.ref.branch || 'master', project.name)
        branch = branch.mirror_master ? project.branch('master') : branch
        jjob.providerConfig = _.extend({}, project.provider.config, config.provider || {})
        if (config) {
          delete config.provider
          jjob.fromStriderJson = true
          config = utils.mergeConfigs(branch, config)
        } else {
          config = _.extend({}, branch)
        }
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
  emitter.on('job.done', this.jobDone.bind(this, emitter))

}

BackChannel.prototype = {

  send: function (project, event, args) {
    if (this.users[project]) {
      this.ws.send(this.users[project], [event, args, 'yours'])
    }
    if (this.public[project]) {
      this.ws.sendPublic(this.users[project], [event, args, 'public'])
    }
  },
  newJob: function (job) {
    var name = job.project.name
      , self = this
    this.waiting[name] = []
    this.public[name] = job.project.public

    async.parallel
    ( { collaborators: function (paraCallback) {
          User.collaborators(name, 0, function (err, users) {
            paraCallback(err, users)
          })
        }
      , admins: function (paraCallback) {
          User.admins(paraCallback)
        }
      }
    , function (err, users) {
        if (err) return console.error('new job: Failed to query for users')
        if (!users.collaborators) return console.error('new job: no users found')
        self.users[name] = []

        users.collaborators.forEach(function (user) {
          self.users[name].push(user._id.toString())
        })
        // also send to system admins
        users.admins.forEach(function (user) {
          self.users[name].push(user._id.toString())
        })

        // Admins maybe collaborators, so unique the array
        self.users[name] = _.uniq(self.users[name])

        var njob = jobs.small(job)
        njob.project = utils.sanitizeProject(job.project)
        self.send(name, 'job.new', [njob])

        self.waiting[name].forEach(function (item) {
          self.send.apply(self, [name].concat(item))
        })
        delete self.waiting[name]
      }
    )
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
  jobDone: function (emitter, data) {
    var self = this
    Job.findById(data.id, function (err, job) {
      if (err) return console.error('Error finding job', err.message)
      if (!job) return console.error('job.done but job not found:', data.id)
      _.extend(job, data)
      try {
        job.duration = data.finished.getTime() - data.started.getTime()
      } catch (ignore) {
        job.duration = 1
      }
      job.markModified('phases')
      job.markModified('plugin_data')
      job.test_exitcode = job.phases.test && job.phases.test.exitCode
      job.deploy_exitcode = job.phases.deploy && job.phases.deploy.exitCode
      job.save()
      job = job.toJSON()

      Project.findOne({name: job.project}).lean().exec(function (err, project) {
        if (err) return console.error('Error finding project for job', err.message, job.project)
        if (!project) return console.error('Project for job.done not found', job.project)

        job.project = utils.sanitizeProject(project)
        job.status = jobs.status(job)
        self.send(project.name, 'job.done', [job])
        emitter.emit('job.doneAndSaved', job)
      })
    })
  }
}

module.exports = BackChannel
