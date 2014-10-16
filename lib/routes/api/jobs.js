/*
 * routes/api/jobs.js
 */

var BASE_PATH = '../../';

var common = require(BASE_PATH + 'common')
  , jobs = require(BASE_PATH + 'jobs')
  , gravatar = require('gravatar')

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
    , message = req.param('message')
    , now = new Date()
    , trigger
    , job
    , Project = common.context.models.Project

    Project.findOne({name: req.project.name}, function (err, project) {
        if(err || !project) {
            return res.json(404);
        }

        trigger = {
            type: 'manual',
            author: {
                id: req.user._id,
                email: req.user.email,
                image: gravatar.url(req.user.email, {}, true)
            },
            timestamp: now,
            source: {type: 'UI', page: req.param('page') || 'unknown'}
        }


        if (message) {
            trigger.message = message;
        } else {
            if (type === 'TEST_AND_DEPLOY')
                trigger.message = 'Manually Redeploying';
            else
                trigger.message =  'Manually Retesting';
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
    });


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
