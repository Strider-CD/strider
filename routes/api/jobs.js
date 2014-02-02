/*
 * routes/api/jobs.js
 */

var BASE_PATH = '../../lib/';

var _ = require('underscore')
  , async = require('async')
  , api = require('./index.js')
  , check = require('validator').check
  , common = require(BASE_PATH + 'common')
  , email = require(BASE_PATH + 'email')
  , humane = require(BASE_PATH + 'humane')
  , jobs = require(BASE_PATH + 'jobs')
  , filter = require(BASE_PATH + 'ansi')
  , gravatar = require('gravatar')
  , ljobs = jobs
  , Job = require(BASE_PATH + 'models').Job
  , User = require(BASE_PATH + 'models').User
  , logging = require(BASE_PATH + 'logging')

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
      image: gravatar.url(req.user.email, {}, true)
    },
    message: type === 'TEST_AND_DEPLOY' ? 'Redeploying' : 'Retesting',
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
  res.json(job)
};

/*
 * GET /api/jobs
 * Return JSON object containing the most recent build status for each configured repo
 * This function is used to build the main dashboard status page
 * The result is separated into {public: [], yours: []}.
 *
 * Note: the private ones are just ones that the current user is a collaborator on. Not necessarily private
 */
exports.jobs = function(req, res) {

  console.log("api.jobs");
  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;

  jobs.latestJobs(req.user, function (err, jobs) {
    res.send(JSON.stringify(jobs, null, '\t'))
  })
}
