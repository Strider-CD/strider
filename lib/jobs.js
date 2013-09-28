
var common = require('./common')
  , config = require('./config')
  , logging = require('./logging')
  , Job = require('./models').Job
  , User = require('./models').User
  , Project = require('./models').Project
  , filter = require('./ansi')
  , utils = require('./utils')

  , _ = require('underscore')
  , Step = require('step')
  , async = require('async')
  , crypto = require('crypto')

var TEST_ONLY = "TEST_ONLY"
var TEST_AND_DEPLOY = "TEST_AND_DEPLOY"

module.exports = {
  startJob: startJob,
  latestJobs: latestJobs,
  jobProject: jobProject,
  status: status,
  small: small
}

function startJob(data, user, project) {
  // Create new Job object in Mongo and link to user
  var job = new Job(data)
  job.save(function (err, job) {
    var json = job.toJSON()
    json.project = project.toJSON()
    json.userProvider = user.providers[project.provider.id]
    common.emitter.emit('job.new', json)
  })
}

// user: user object
// done(err, {yours: [...], public: [...]})
function latestJobs(user, done) {
  var tasks = {public: latestPublicJobs.bind(null, user)}
  if (user) {
    tasks.yours = latestUsersJobs.bind(null, user)
  }
  async.parallel(tasks, done)
}

// failed, passed, errored, running, submitted
function status(job) {
  if (job.errored) return 'errored'
  if (!job.started) return 'submitted'
  if (!job.finished) return 'running'
  if (job.test_exitcode !== 0) return 'failed'
  if (job.type !== 'TEST_ONLY' && job.deploy_exitcode !== 0) return 'failed'
  return 'passed'
}

function small(job) {
  var big = ['phases', 'plugin_data', 'std', 'stderr', 'stdout', 'stdmerged']
    , njob = {}
  if (job.toJSON) job = job.toJSON()
  for (var name in job) {
    if (big.indexOf(name) !== -1) continue;
    njob[name] = job[name]
  }
  njob.status = status(job)
  return njob
}

function jobProject(project, prev) {
  for (var i=0; i<prev.length; i++) {
    prev[i].status = status(prev[i])
  }
  project = utils.sanitizeProject(project)
  project.prev = prev
  return project
}

function latestJob(project, done) {
  Job.find({project: project.name.toLowerCase()})
    .sort({finished: -1})
    .limit(6)
    .lean().exec(function (err, jobs) {
      if (!jobs || !jobs.length) return done(err, {nojobs: true, project: jobProject(project, [])})
      var job = jobs[0]
      job.project = jobProject(project, jobs.slice(1))
      job.status = status(job)
      done(err, job)
    })
}

function projectJobs(projects, done) {
  var tasks = []
  projects.forEach(function (project) {
    tasks.push(latestJob.bind(null, project))
  })
  async.parallel(tasks, function (err, jobs) {
    if (err) return done(err)
    jobs.sort(jobSort)
    done(null, jobs)
  })
}

function latestPublicJobs(user, done) {
  var query = Project.find({public: true}).lean()
  if (user) {
    query = query.where('name', {$not: {$in: Object.keys(user.projects || {})}})
  }
  query.exec(function (err, projects) {
    if (err) return done(err)
    projectJobs(projects, done)
  })
}

function latestUsersJobs(user, done) {
  Project.forUser(user, function (err, projects) {
    if (err) return done(err)
    projectJobs(projects, done)
  })
}

function jobSort(a, b) {
  if (!a.latest) return -1
  if (!b.latest) return 1
  if (!a.latest.finished || !a.latest.finished.getTime) return -1
  if (!b.latest.finished || !b.latest.finished.getTime) return 1
  return b.latest.finished.getTime() - a.latest.finished.getTime()
}
