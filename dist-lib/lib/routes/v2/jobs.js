"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const co_router_1 = __importDefault(require("co-router"));
const middleware_1 = __importDefault(require("../../middleware"));
const common_1 = __importDefault(require("../../common"));
const config_1 = __importDefault(require("../../config"));
const debug_1 = __importDefault(require("debug"));
const jobs_1 = __importDefault(require("../../jobs"));
const models_1 = __importDefault(require("../../models"));
const utils_1 = __importDefault(require("../../utils"));
const debug = debug_1.default('strider:routes:jobs');
const Job = models_1.default.Job;
const router = new co_router_1.default();
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
    const runner = common_1.default.extensions.runner[job.runner.id];
    if (runner)
        return runner.getJobData(job._id) || {};
}
/*
 * GET /org/repo/[job/:job_id] - view latest build for repo
 *
 * middleware.project set "project" and "accessLevel" on the req object.
 */
router.get('/:org/:repo', middleware_1.default.project, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params.org === 'auth') {
            return next();
        }
        const projectName = req.project.name;
        const jobsQuantity = req.user
            ? req.user.jobsQuantityOnPage
            : config_1.default.jobsQuantityOnPage.default;
        try {
            let jobs = yield Job.find({ project: projectName, archived: null })
                .sort({ finished: -1 })
                .limit(jobsQuantity);
            // Use our custom sort function
            jobs.sort(jobs_1.default.sort);
            try {
                let running = yield Job.find({
                    project: projectName,
                    archived: null,
                    finished: null,
                }).sort({ started: -1 });
                running = running.map((job) => {
                    lodash_1.default.extend(job, findJob(job));
                    delete job.data;
                    delete job.id;
                    return job;
                });
                jobs = running.concat(jobs).map((job) => {
                    // job = ljobs.small(job);
                    job = filterJob(job);
                    job.status = jobs_1.default.status(job);
                    return job;
                });
                // Make sure jobs are only listed once.
                jobs = lodash_1.default.uniqBy(jobs, (job) => job._id.toString());
                debug('Build page jobs', jobs);
                res.json(jobs);
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
});
router.get('/:org/:repo/latest', middleware_1.default.project, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params.org === 'auth') {
            return next();
        }
        const projectName = req.project.name;
        let [job] = yield Job.find({
            project: projectName,
            archived: null,
        }).limit(1);
        if (job) {
            const sanitized = utils_1.default.sanitizeProject(req.project);
            sanitized.access_level = req.accessLevel;
            job = filterJob(job);
            job.project = sanitized;
            job.status = jobs_1.default.status(job);
        }
        res.json(job);
    });
});
router.get('/:org/:repo/job/:jobId', middleware_1.default.project, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.params.org === 'auth') {
            return next();
        }
        const projectName = req.project.name;
        let job = yield Job.findOne({
            _id: req.params.jobId,
            project: projectName,
            archived: null,
        });
        if (job) {
            const sanitized = utils_1.default.sanitizeProject(req.project);
            sanitized.access_level = req.accessLevel;
            job = filterJob(job);
            job.project = sanitized;
            job.status = jobs_1.default.status(job);
        }
        res.json(job);
    });
});
exports.default = router;
//# sourceMappingURL=jobs.js.map