/*
 * routes/jobs/index.js
 */

var BASE_PATH = "../../"

var  _ = require('lodash')
   , filter = require(BASE_PATH + 'ansi')
   , common = require(BASE_PATH + 'common')
   , ljobs = require(BASE_PATH + 'jobs')
   , utils = require(BASE_PATH + 'utils')

   , models = require(BASE_PATH + 'models')
   , Job = models.Job
   , pjson = require('../../../package.json')

module.exports = {
  html: html,
  multijob: multijob,
  jobs: jobs
}

/*
 * GET /org/repo/[job/:job_id] - view latest build for repo
 *
 * middleware.project set "project" and "accessLevel" on the req object.
 */
function multijob(req, res) {
  var type = req.accepts('html', 'json', 'plain')
  switch (type) {
    case 'json':
      return data(req, res)
    case 'plain':
      return output(req, res)
    default:
      return html(req, res)
  }
}

function filterJob(job) {
  if (job.trigger.message === 'Retest') {
    job.trigger.message = 'Manually Retested'
  }
  if (job.trigger.message === 'Redeploy') {
    job.trigger.message = 'Manually Redeployed'
  }
  return job
}

function findJob(job) {
  // job.runner can be undefined if it hasn't been fully prepared yet.
  // this is a sort of race between job.prepare and job.new events.
  // fixes https://github.com/Strider-CD/strider/issues/273
  if (!job.runner) return

  var runner = common.extensions.runner[job.runner.id]
  if (runner) return runner.getJobData(job._id) || {}
}


function html(req, res) {
  var id = req.params.id
  var projectName = req.project.name
  Job.find({project: projectName, archived: null}).sort({finished:-1}).limit(20).lean().exec(function (err, jobs) {
    if (err) {
      console.debug('[job] error finding jobs', err.message)
      return res.send(500, 'Failed to find jobs')
    }
    // Use our custom sort function
    jobs.sort(ljobs.sort)

    Job.find({project: projectName, archived: null, finished: null}).sort({started: -1}).lean().exec(function (err, running) {
      if (err) {
        console.debug('[job] error finding running jobs', err.message)
        return res.send(500, 'Failed to find running jobs')
      }
      var i
      for (i=0; i<running.length; i++) {
        _.extend(running[i], findJob(running[i]))
        delete running[i].data
        delete running[i].id
      }
      jobs = running.concat(jobs)
      var job = id ? null : jobs[0]
      for (i=0; i<jobs.length; i++) {
        if (!job && jobs[i]._id === id) job = jobs[i]
        jobs[i] = ljobs.small(jobs[i])
        jobs[i] = filterJob(jobs[i])
      }
      if (job) job.status = ljobs.status(job)

      var showStatus = {}
      , sanitized = utils.sanitizeProject(req.project)
      sanitized.access_level = req.accessLevel
      req.project.branches.forEach(function (branch) {
        var plugins = showStatus[branch.name] = {}
        branch.plugins.forEach(function (plugin) {
          plugins[plugin.id] = plugin.enabled && plugin.showStatus
        })
      })

      var isGlobalAdmin = req.user && req.user.account_level > 0
        , canAdminProject = sanitized.access_level > 0 || isGlobalAdmin

      res.format({
        html: function() {
          res.render('build.html', {
            project: sanitized,
            accessLevel: req.accessLevel,
            canAdminProject: canAdminProject,
            jobs: jobs,
            job: job,
            statusBlocks: common.statusBlocks,
            showStatus: showStatus,
            page_base: req.params.org + '/' + req.params.repo,
            version: pjson.version
          })
        },
        json: function() {
          res.send({
            project: sanitized,
            accessLevel: req.accessLevel,
            canAdminProject: canAdminProject,
            jobs: jobs,
            job: job
          })
        }
      })
    })
  })
}

function getJob(req, res, next) {
  var query
  if (!req.params.job_id) {
    query = Job.findOne({project: req.project.name.toLowerCase(), archived: null}, {}, {sort: {finished: -1}})
  } else {
    query = Job.findOne({project: req.project.name.toLowerCase(), _id: req.params.job_id, archived: null})
  }
  query.exec(function (err, job) {
    if (err || !job) return res.send(404, 'Failed to find job')
    job = filterJob(job)
    if (!job.finished) {
      _.extend(job, findJob(job))
    }
    next(job)
  })
}

function output(req, res) {
  getJob(req, res, function (job) {
    res.setHeader('Content-type', 'text/plain');
    res.send(job.std.merged ? filter(job.std.merged) : '')
  })
}

function data(req, res) {
  getJob(req, res, function (job) {
    res.setHeader('Content-type', 'application/json')
    res.send(job)
  })
}

function jobs(req, res) {
  Job.find({project: req.project.name.toLowerCase(), archived: null})
     .sort({finished: -1}).limit(20).lean()
     .exec(function (err, jobs) {
       if (err) return res.send(500, 'Failed to retrieve jobs')
       res.send(JSON.stringify(jobs.map(function(j) { return filterJob(j) })))
     })
}
