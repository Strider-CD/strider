/*
 * routes/jobs/index.js
 */

var BASE_PATH = "../../lib/"

var  _ = require('underscore')
   , crypto = require('crypto')
   , mongoose = require('mongoose')
   , Step = require('step')

   , filter = require(BASE_PATH + 'ansi')
   , common = require(BASE_PATH + 'common')
   , humane = require(BASE_PATH + 'humane')
   , logging = require(BASE_PATH + 'logging')
   , ljobs = require(BASE_PATH + 'jobs')
   , utils = require(BASE_PATH + 'utils')

   , models = require(BASE_PATH + 'models')
   , Job = models.Job
   , User = models.User
   , Project = models.Project

module.exports = {
  html: html,
  multijob: multijob,
  badge: badge,
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

function html(req, res) {
  var id = req.params.id
  var projectName = req.project.name
  Job.find({project: projectName}).sort('-finished').limit(20).lean().exec(function (err, jobs) {
    jobs.sort(ljobs.sort)
    var job = id ? null : jobs[0]
    for (var i=0; i<jobs.length; i++) {
      if (!job && jobs[i]._id === id) job = jobs[i]
      jobs[i] = ljobs.small(jobs[i])
      jobs[i] = filterJob(jobs[i])
    }
    if (job) job.status = ljobs.status(job)

    var showStatus = {}
    req.project.branches.forEach(function (branch) {
      var plugins = showStatus[branch.name] = {}
      branch.plugins.forEach(function (plugin) {
        plugins[plugin.id] = plugin.enabled && plugin.showStatus
      })
    })
    res.render('build.html', {
      project: utils.sanitizeProject(req.project),
      accessLevel: req.accessLevel,
      jobs: jobs,
      job: job,
      statusBlocks: common.statusBlocks,
      showStatus: showStatus,
      page_base: req.params.org + '/' + req.params.repo
    })
  })
}

function getJob(req, res, next) {
  var query
  if (!req.params.job_id) {
    query = Job.findOne({project: req.project.name.toLowerCase()}, {}, {sort: {finished: -1}})
  } else {
    query = Job.findOne({project: req.project.name.toLowerCase(), _id: req.params.job_id})
  }
  query.exec(function (err, job) {
    if (err || !job) return res.send(404, 'Failed to find job')
    job = filterJob(job)
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
    req.setHeader('Content-type', 'application/json')
    res.send(job)
  })
}

function jobs(req, res) {
  Job.find({project: req.project.name.toLowerCase()})
     .sort({finished: -1}).limit(20).lean()
     .exec(function (err, jobs) {
       if (err) return res.send(500, 'Failed to retrieve jobs')
       res.send(JSON.stringify(jobs.map(function(j) { return filterJob(j) })))
     })
}

/*
 * index.badge - redirect to the right badge
 */
function badge(req, res) {
  var name = req.params.org + '/' + req.params.repo
  Project.findOne({name: name.toLowerCase()}, function (err, project) {
    Job.findOne()
      .sort({'finished': -1})
      .where('finished').ne(null)
      .where('archived', null)
      .where('project', name.toLowerCase())
      .exec(function(err, job) {
        var status = 'failing'
        if (err || !job) {
          if (err) {
            console.debug('[badge] error looking for latest build', err.message);
          }
          status = 'unknown'
        } else if (job.test_exitcode === 0) status = 'passing'
        res.setHeader("Cache-Control", "no-cache")
        res.redirect('/images/badges/build_' + status + '.png')
      })
  })
}

