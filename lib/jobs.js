
module.exports = {
  latestJobs: latestJobs,
  jobProject: jobProject,
  sort: jobSort,
  status: status,
  small: small
}

var Job = require('./models').Job
  , User = require('./models').User
  , Project = require('./models').Project
  , utils = require('./utils')
  , async = require('async')

var TEST_ONLY = "TEST_ONLY"
var TEST_AND_DEPLOY = "TEST_AND_DEPLOY"

// user: user object
// small: if true, "phases" and "std" will not be fetched for the jobs
// - dramatically reducing the size of the object.
// TODO: add paging
// done(err, {yours: [...], public: [...]})
function latestJobs(user, small, done) {
  if (arguments.length === 2) {
    done = small
    small = false
  }
  var tasks = {public: latestPublicJobs.bind(null, user, small)}
  if (user) {
    tasks.yours = latestUsersJobs.bind(null, user, small)
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

function latestJob(project, small, done) {
  var query = Job.find({project: project.name.toLowerCase(), archived: null})
                 .sort({finished: -1})
                 .limit(6)
                 .lean()
  if (small) query = query.select('-phases -std')
  query.exec(function (err, jobs) {
      if (!jobs || !jobs.length) return done(err, {nojobs: true, project: jobProject(project, [])})
      var job = jobs[0]
      job.project = jobProject(project, jobs.slice(1))
      job.status = status(job)
      done(err, job)
    })
}

function projectJobs(projects, small, done) {
  if (arguments.length === 2) {
    done = small
    small = false
  }
  var tasks = []
  projects.forEach(function (project) {
    tasks.push(latestJob.bind(null, project, small))
  })
  async.parallel(tasks, function (err, jobs) {
    if (err) return done(err)
    jobs.sort(jobSort)
    done(null, jobs)
  })
}

function latestPublicJobs(user, small, done) {
  // If we are an admin, all projects will be returned in UserJobs
  if (user && user.account_level > 0) return done(null, [])
  if (arguments.length === 2) {
    done = small
    small = false
  }
  var query = Project.find({public: true}).lean()
  if (user) {
    var userProjects = user.projects.map(function(p) {
      return p.name.toLowerCase()
    })
    query = query.where('name', {$not: {$in: userProjects || []}})
  }
  query.exec(function (err, projects) {
    if (err) return done(err)
    projectJobs(projects, small, done)
  })
}

function latestUsersJobs(user, small, done) {
  if (arguments.length === 2) {
    done = small
    small = false
  }
  Project.forUser(user, function (err, projects) {
    if (err) return done(err)
    projectJobs(projects, small, done)
  })
}

function jobSort(a, b) {
  if (a.nojobs) {
    if (b.nojobs) return 0
    return -1
  }
  if (b.nojobs) return 1
  if (a.status === 'running') {
    if (b.status === 'running') return 0
    return -1
  }
  if (b.status === 'running') return 1
  if (a.status === 'submitted') {
    if (b.status === 'submitted') return 0
    return -1
  }
  if (b.status === 'submitted') return 1
  if (!a.finished || !a.finished.getTime) return -1
  if (!b.finished || !b.finished.getTime) return 1
  return b.finished.getTime() - a.finished.getTime()
}
