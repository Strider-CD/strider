/*
 * routes/api/jobs.js
 */

var BASE_PATH = '../../lib/';

var _ = require('underscore')
  , Step = require('step')
  , api = require('./index.js')
  , check = require('validator').check
  , common = require(BASE_PATH + 'common')
  , email = require(BASE_PATH + 'email')
  , humane = require(BASE_PATH + 'humane')
  , jobs = require(BASE_PATH + 'jobs')
  , filter = require(BASE_PATH + 'ansi')
  , ljobs = jobs
  , Job = require(BASE_PATH + 'models').Job
  , User = require(BASE_PATH + 'models').User
  , logging = require(BASE_PATH + 'logging')
  ;

var TEST_ONLY = "TEST_ONLY";
var TEST_AND_DEPLOY = "TEST_AND_DEPLOY";

/*
 * POST /:repo/:name/start
 * Requires query param <url> which is the Github html_url of the project.
 * By default runs a TEST_ONLY job.
 *
 * Accepts optional query param <type> which can be one of:
 *  TEST_ONLY - start a TEST_ONLY job.
 *  TEST_AND_DEPLOY - start a TEST_AND_DEPLOY job.
 */
exports.jobs_start = function(req, res) {
  var type = req.param('type') || TEST_ONLY
    , branch = req.param('branch') || 'master'
    , now = new Date()
    , trigger
    , job
  trigger = {
    type: 'manual',
    author: {
      id: req.user._id,
      email: req.user.email,
      image: null // TODO make gravatar from email
    },
    message: 'Manual trigger',
    timestamp: now,
    source: {type: 'UI', page: req.param('page') || 'unknown'}
  }
  job = {
    type: type,
    user_id: req.user._id,
    project: req.project.name,
    ref: {branch: branch},
    trigger: trigger,
    created: now
  }
  common.emitter.emit('job.prepare', job)
};

/*
 * GET /api/jobs
 * Return JSON object containing the most recent build status for each configured repo
 * This function is used to build the main dashboard status page
 */
exports.jobs = function(req, res) {

  console.log("api.jobs");
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  var query
  if (!req.user || !req.user.projects) {
    // TODO allow anonymous view for public projects
    return res.send(401, 'Anonymous access not allowed')
  }
  var projects = Object.keys(req.user.projects)
    , tasks = []
  projects.forEach(function (project) {
    tasks.push(function (next) {
      Job.find({project: project})
         .sort({finished: -1})
         .limit(6)
         .lean().exec(function (err, jobs) {
           next(err, {
             name: project,
             latest: jobs && jobs[0],
             previous: jobs && jobs.slice(1)
           })
         })
    })
  })
  async.parallel(tasks, function (err, projects) {
    if (err) return res.send(500, 'Failed to get most recent jobs')
    projects.sort(function(a, b) {
      if (!a.latest) return -1
      if (!b.latest) return 1
      if (!a.latest.finished || !a.latest.finished.getTime) return -1
      if (!b.latest.finished || !b.latest.finished.getTime) return 1
      return b.latest.finished.getTime() - a.latest.finished.getTime()
    });
    var output = JSON.stringify(projects, null, '\t');
    res.end(output);
  });
}
