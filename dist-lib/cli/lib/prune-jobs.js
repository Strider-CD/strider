'use strict';
const Bluebird = require('bluebird');
const colors = require('colors');
module.exports = function (deps) {
    const models = deps.models();
    const Project = models.Project;
    const Job = models.Job;
    return function pruneJobs(keepNumJobs, projectName, dryRun) {
        if (dryRun) {
            console.log('** Dry Run **\n');
        }
        findProjects(projectName, Project)
            .then(function (projects) {
            return Bluebird.map(projects, function (project) {
                return removeJobsAfterLatest(keepNumJobs, project.name, dryRun, Job);
            });
        })
            .catch(function (err) {
            console.log(colors.red(err.message || err));
        })
            .finally(function () {
            process.exit(1);
        });
    };
};
/**
 * Find all projects, or just the one specified
 *
 * @private
 * @param {String} name name identified or project, user/name format
 * @param {Model<Project>} Project mongoose model
 * @returns {Promise} resolves to an array of projects
 */
function findProjects(name, Project) {
    let query;
    if (name) {
        query = Project.findOne({ name: name }).exec();
    }
    else {
        query = Project.find().exec();
    }
    return query.then(function (res) {
        return res.length ? res : [res];
    });
}
/**
 * Finds all jobs for project, and removes if not a dry run;
 *
 * @private
 * @param {Number} keepJobs number of jobs to keep, defaults to 20
 * @param {String} projectName user/name format
 * @param {Boolean} dryRun just print the stats, no actual removal done
 * @returns {Promise} resolves once stats printed, or jobs removed
 */
function removeJobsAfterLatest(keepJobs, projectName, dryRun, Job) {
    return Job.find({ project: projectName })
        .select('created')
        .sort('-created')
        .exec()
        .then(function (jobs) {
        const toRemove = jobs.slice(keepJobs);
        logStats(projectName, jobs, toRemove, dryRun);
        if (!dryRun && toRemove.length) {
            return Bluebird.map(toRemove, function (job) {
                return job.remove();
            }).then(function () {
                console.log(colors.yellow('    ' + toRemove.length + ' jobs removed'));
            });
        }
    });
}
/**
 * Log stats for job removal of a project
 *
 * @private
 * @param {String} projectName
 * @param {Array<Job>} allJobs
 * @param {Array<Job>} toRemove
 */
function logStats(projectName, allJobs, toRemove) {
    if (!toRemove.length) {
        return console.log(colors.green('No jobs to remove'));
    }
    const log = [
        colors.green(colors.bold('Removing jobs for "' + projectName + '":')),
        '    Keeping Latest ' + (allJobs.length - toRemove.length) + ' jobs.',
        '    Total Jobs: ' + allJobs.length,
        '      Latest job created on: ' + allJobs[0].created,
        '      Oldest job created on: ' + allJobs[allJobs.length - 1].created,
        '    Jobs To Remove: ' + toRemove.length,
        '      Latest job created on: ' + toRemove[0].created,
        '      Oldest job created on: ' + toRemove[toRemove.length - 1].created,
    ];
    console.log(log.join('\n'));
}
//# sourceMappingURL=prune-jobs.js.map