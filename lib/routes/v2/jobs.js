const _ = require('lodash');
const Router = require('co-router');
const middleware = require('../../middleware');

const common = require('../../common');
const config = require('../../config');
const debug = require('debug')('strider:routes:jobs');
const ljobs = require('../../jobs');
const models = require('../../models');
const utils = require('../../utils');

const Job = models.Job;
const router = new Router();

/*
 * GET /org/repo/[job/:job_id] - view latest build for repo
 *
 * middleware.project set "project" and "accessLevel" on the req object.
 */
router.get('/:org/:repo', middleware.project, async function (req, res, next) {
  let jobs = await projectJobs(req, res, next);
  res.json(jobs);
});

router.get('/:org/:repo/latest', middleware.project, async function (
  req,
  res,
  next
) {
  if (req.params.org === 'auth') {
    return next();
  }

  let projectName = req.project.name;
  let [job] = await Job.find({ project: projectName, archived: null }).limit(1);
  if (job) {
    let sanitized = utils.sanitizeProject(req.project);

    sanitized.access_level = req.accessLevel;
    job = filterJob(job);
    job.project = sanitized;
    job.status = ljobs.status(job);
  }
  res.json(job);
});

module.exports = router;

function filterJob(job) {
  if (job.trigger.message === 'Retest') {
    job.trigger.message = 'Manually Retested';
  }
  if (job.trigger.message === 'Redeploy') {
    job.trigger.message = 'Manually Redeployed';
  }
  return job;
}

function findJob(job) {
  // job.runner can be undefined if it hasn't been fully prepared yet.
  // this is a sort of race between job.prepare and job.new events.
  // fixes https://github.com/Strider-CD/strider/issues/273
  if (!job.runner) return;

  var runner = common.extensions.runner[job.runner.id];
  if (runner) return runner.getJobData(job._id) || {};
}

async function projectJobs(req, res, next) {
  if (req.params.org === 'auth') {
    return next();
  }

  const projectName = req.project.name;
  const jobsQuantity = req.user
    ? req.user.jobsQuantityOnPage
    : config.jobsQuantityOnPage.default;

  try {
    let jobs = await Job.find({ project: projectName, archived: null })
      .sort({ finished: -1 })
      .limit(jobsQuantity)
      .lean();

    // Use our custom sort function
    jobs.sort(ljobs.sort);

    try {
      let running = await Job.find({
        project: projectName,
        archived: null,
        finished: null,
      })
        .sort({ started: -1 })
        .lean();

      running = running.map((job) => {
        _.extend(job, findJob(job));
        delete job.data;
        delete job.id;
        return job;
      });
      jobs = running.concat(jobs).map((job) => {
        job = ljobs.small(job);
        job = filterJob(job);
        return job;
      });

      // Make sure jobs are only listed once.
      jobs = _.uniqBy(jobs, (job) => job._id.toString());

      debug('Build page jobs', jobs);
      return jobs;
    } catch (err) {
      debug('[job] error finding running jobs', err.message);
      throw new Error('Failed to find running jobs');
    }
  } catch (err) {
    debug('[job] error finding jobs', err.message);
    throw new Error('Failed to find jobs');
  }
}
