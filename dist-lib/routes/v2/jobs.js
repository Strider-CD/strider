var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _ = require('lodash');
const Router = require('co-router');
var middleware = require('../../middleware');
var common = require('../../common');
var config = require('../../config');
var debug = require('debug')('strider:routes:jobs');
var ljobs = require('../../jobs');
var models = require('../../models');
var pjson = require('../../../package.json');
var utils = require('../../utils');
var Job = models.Job;
const router = new Router();
router.get('/:org/:repo', middleware.project, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let result = yield projectJobs(req, res, next);
        res.json(result);
    });
});
module.exports = router;
/*
 * GET /org/repo/[job/:job_id] - view latest build for repo
 *
 * middleware.project set "project" and "accessLevel" on the req object.
 */
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
    if (!job.runner)
        return;
    var runner = common.extensions.runner[job.runner.id];
    if (runner)
        return runner.getJobData(job._id) || {};
}
function projectJobs(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params.org === 'auth') {
            return next();
        }
        var id = req.params.id;
        var projectName = req.project.name;
        var jobsQuantity = req.user
            ? req.user.jobsQuantityOnPage
            : config.jobsQuantityOnPage.default;
        try {
            let jobs = yield Job.find({ project: projectName, archived: null })
                .sort({ finished: -1 })
                .limit(jobsQuantity)
                .lean();
            // Use our custom sort function
            jobs.sort(ljobs.sort);
            try {
                let running = yield Job.find({
                    project: projectName,
                    archived: null,
                    finished: null
                })
                    .sort({ started: -1 })
                    .lean();
                var i;
                for (i = 0; i < running.length; i++) {
                    _.extend(running[i], findJob(running[i]));
                    delete running[i].data;
                    delete running[i].id;
                }
                jobs = running.concat(jobs);
                var showStatus = {};
                var sanitized = utils.sanitizeProject(req.project);
                sanitized.access_level = req.accessLevel;
                req.project.branches.forEach(function (branch) {
                    var plugins = (showStatus[branch.name] = {});
                    branch.plugins.forEach(function (plugin) {
                        plugins[plugin.id] = plugin.enabled && plugin.showStatus;
                    });
                });
                var job = id ? null : jobs[0];
                for (i = 0; i < jobs.length; i++) {
                    if (!job && jobs[i]._id === id)
                        job = jobs[i];
                    jobs[i] = ljobs.small(jobs[i]);
                    jobs[i] = filterJob(jobs[i]);
                    jobs[i].project = sanitized;
                }
                if (job) {
                    job.status = ljobs.status(job);
                    job.project = sanitized;
                }
                var isGlobalAdmin = req.user && req.user.account_level > 0;
                var canAdminProject = sanitized.access_level > 0 || isGlobalAdmin;
                // Make sure jobs are only listed once.
                jobs = _.uniqBy(jobs, job => job._id.toString());
                debug('Build page requested. Logging jobs to investigate duplicate job listings.', jobs);
                return {
                    project: sanitized,
                    accessLevel: req.accessLevel,
                    canAdminProject: canAdminProject,
                    jobs: jobs,
                    job: job,
                    statusBlocks: common.statusBlocks,
                    showStatus: showStatus,
                    page_base: `${req.params.org}/${req.params.repo}`,
                    version: pjson.version
                };
            }
            catch (err) {
                debug('[job] error finding running jobs', err.message);
                throw new Error('Failed to find running jobs');
            }
        }
        catch (err) {
            debug('[job] error finding jobs', err.message);
            throw new Error('Failed to find jobs');
        }
    });
}
//# sourceMappingURL=jobs.js.map