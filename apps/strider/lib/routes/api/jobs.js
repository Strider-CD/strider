const common = require('../../common');
const debug = require('debug')('strider:routes:api:jobs');
const jobs = require('../../jobs');
const utils = require('../../utils');

const TEST_ONLY = 'TEST_ONLY';
const TEST_AND_DEPLOY = 'TEST_AND_DEPLOY';

/**
 * @api {post} /:org/:repo/start Start Job
 * @apiUse ProjectReference
 * @apiDescription Executes a strider test and, optionally, deployment.
 * @apiName StartJob
 * @apiGroup Job
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} CURL Example:
 *    curl -X POST http://localhost/api/strider-cd/strider/start
 *
 * @apiParam (RequestBody) {String} type="TEST_ONLY" Denotes the type of job to run.
 * This can be "TEST_ONLY", which indicates that only the test stages of the job should
 * be executed or "TEST_AND_DEPLOY", which indicates that all stages should be executed.
 * @apiParam (RequestBody) {String} branch="master" Indicates which branch configuration
 * should be executed.
 * @apiParam (RequestBody) {String} message="Manually Retesting/Redeploying" An
 * optional message to include as the title of the execution.
 */
exports.jobsStart = function (req, res) {
  const type = req.body.type || TEST_ONLY;
  const branch = req.body.branch || 'master';
  const message = req.body.message;
  const now = new Date();
  let trigger;
  let job;
  const Project = common.context.models.Project;

  Project.findOne({ name: req.project.name }, function (err, project) {
    if (err || !project) {
      return res.json(404);
    }

    trigger = {
      type: 'manual',
      author: {
        id: req.user._id,
        email: req.user.email,
        image: utils.gravatar(req.user.email),
      },
      timestamp: now,
      source: { type: 'UI', page: req.body.page || 'unknown' },
    };

    if (message) {
      trigger.message = message;
    } else {
      if (type === TEST_AND_DEPLOY) trigger.message = 'Manually Redeploying';
      else trigger.message = 'Manually Retesting';
    }

    job = {
      type: type,
      user_id: req.user._id,
      project: req.project.name,
      ref: { branch: branch },
      trigger: trigger,
      created: now,
    };
    common.emitter.emit('job.prepare', job);
    res.json(job);
  });
};

/**
 * @api {get} /api/jobs Get Latest Jobs
 * @apiDescription Return JSON object containing the most recent build status for each configured repo
 * This function is used to build the main dashboard status page.
 * The result is separated into `{public: [], yours: []}`.
 *
 * Note: the private ones are just ones that the current user is a collaborator
 * on and are not necessarily private
 * @apiName GetJobs
 * @apiGroup Job
 * @apiVersion 1.0.0
 *
 * @apiExample {curl} CURL Example:
 *    curl -X GET http://localhost/api/jobs
 */
exports.jobs = function (req, res) {
  debug('api.jobs');
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;

  jobs.latestJobs(req.user, function (err, jobs) {
    res.send(JSON.stringify(jobs, null, '\t'));
  });
};
