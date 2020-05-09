// eslint-disable-next-line no-unused-vars
import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import Router from 'co-router';
import middleware from '../../middleware';

import common from '../../common';
import config from '../../config';
import setupDebug from 'debug';
import ljobs from '../../jobs';
import models from '../../models';
import utils from '../../utils';

const debug = setupDebug('strider:routes:jobs');
const Job = models.Job;
const router = new Router();

type StriderRequest = Request & {
  user: any;
  project: any;
  accessLevel: string;
};

function filterJob(job: any): any {
  if (job.trigger.message === 'Retest') {
    job.trigger.message = 'Manually Retested';
  }
  if (job.trigger.message === 'Redeploy') {
    job.trigger.message = 'Manually Redeployed';
  }
  return job;
}

function findJob(job: any): any {
  // job.runner can be undefined if it hasn't been fully prepared yet.
  // this is a sort of race between job.prepare and job.new events.
  // fixes https://github.com/Strider-CD/strider/issues/273
  if (!job.runner) return;

  const runner = (common as any).extensions.runner[job.runner.id];
  if (runner) return runner.getJobData(job._id) || {};
}

async function projectJobs(
  req: StriderRequest,
  res: Response,
  next: NextFunction
): Promise<any> {
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
      .limit(jobsQuantity);

    // Use our custom sort function
    jobs.sort(ljobs.sort);

    try {
      let running = await Job.find({
        project: projectName,
        archived: null,
        finished: null,
      }).sort({ started: -1 });

      running = running.map((job: any) => {
        _.extend(job, findJob(job));
        delete job.data;
        delete job.id;
        return job;
      });
      jobs = running.concat(jobs).map((job: any) => {
        // job = ljobs.small(job);
        job = filterJob(job);
        job.status = ljobs.status(job);
        return job;
      });

      // Make sure jobs are only listed once.
      jobs = _.uniqBy(jobs, (job: any) => job._id.toString());

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

/*
 * GET /org/repo/[job/:job_id] - view latest build for repo
 *
 * middleware.project set "project" and "accessLevel" on the req object.
 */
router.get('/:org/:repo', middleware.project, async function (
  req: StriderRequest,
  res: Response,
  next: NextFunction
) {
  const jobs = await projectJobs(req, res, next);
  res.json(jobs);
});

router.get('/:org/:repo/latest', middleware.project, async function (
  req: StriderRequest,
  res: Response,
  next: NextFunction
) {
  if (req.params.org === 'auth') {
    return next();
  }

  const projectName = req.project.name;
  let [job]: any = await Job.find({
    project: projectName,
    archived: null,
  }).limit(1);

  if (job) {
    const sanitized = utils.sanitizeProject(req.project) as any;

    sanitized.access_level = req.accessLevel;
    job = filterJob(job);
    job.project = sanitized;
    job.status = ljobs.status(job);
  }

  res.json(job);
});

router.get('/:org/:repo/job/:jobId', middleware.project, async function (
  req: StriderRequest,
  res: Response,
  next: NextFunction
) {
  if (req.params.org === 'auth') {
    return next();
  }

  const projectName = req.project.name;
  let job: any = await Job.findOne({
    _id: req.params.jobId,
    project: projectName,
    archived: null,
  });

  if (job) {
    const sanitized = utils.sanitizeProject(req.project) as any;

    sanitized.access_level = req.accessLevel;
    job = filterJob(job);
    job.project = sanitized;
    job.status = ljobs.status(job);
  }

  res.json(job);
});

export default router;
