/*
 * Backchannel server allows workers to stream messages back to the Node server
 * in a line-buffered way. Uses SSL.
 */
const _ = require('lodash');
const async = require('async');
const common = require('./common');
require('./config');
const debug = require('debug')('strider:backchannel');
const jobs = require('./jobs');
const models = require('./models');
const utils = require('./utils');
const Job = models.Job;
const User = models.User;
const Project = models.Project;
function striderJson(provider, project, ref, done) {
    function finished(err, contents) {
        if (err || !contents)
            return done(err);
        let data = {};
        try {
            data = JSON.parse(contents);
        }
        catch (e) {
            debug('Strider config is invalid JSON for', project, ref);
            debug(contents);
        }
        done(undefined, data);
    }
    if (!provider.hosted) {
        return provider.getFile('strider.json', ref, project.provider.config, project, finished);
    }
    const account = project.creator.account(project.provider.id, project.provider.account);
    provider.getFile('strider.json', ref, account.config, project.provider.config, project, finished);
}
/**
 * Prepare the job for execution, save to database, and fire off a `job.new` event.
 *
 * job is expected to be populated with:
 * - a trigger
 * - a ref
 * - the project name
 * - the user id (if applicable)
 * - type
 * - created timestamp
 *
 * XXX: should this function go in a different file? idk. We'll
 * definitely move it around when we make strider OO.
 */
function prepareJob(emitter, job) {
    Project.findOne({ name: job.project })
        .populate('creator')
        .exec(function (err, project) {
        if (err || !project)
            return debug('job.prepare - failed to get project', job.project, err);
        // ok so the project is real, we can go ahead and save this job
        const provider = common.extensions.provider[project.provider.id];
        if (!provider) {
            return debug('job.prepare - provider not found for project', job.project, project.provider.id);
        }
        Job.create(job, function (err, mjob) {
            if (err)
                return debug('job.prepare - failed to save job', job, err);
            const jjob = mjob.toJSON();
            jjob.project = project;
            jjob.providerConfig = project.provider.config;
            jjob.fromStriderJson = true;
            striderJson(provider, project, job.ref, function (err, config) {
                if (err) {
                    if (err.status === 403 || err.statusCode === 403) {
                        debug('job.prepare - access to strider.json is forbidden, skipping config merge');
                        config = {};
                        jjob.fromStriderJson = false;
                    }
                    else if (err.status === 404 || err.statusCode === 404) {
                        debug('job.prepare - strider.json not found, skipping config merge');
                        config = {};
                        jjob.fromStriderJson = false;
                    }
                    else {
                        debug("job.prepare - error opening/processing project's `strider.json` file: ", err);
                        config = {};
                        jjob.fromStriderJson = false;
                    }
                }
                else {
                    debug('Using configuration from "strider.json".');
                }
                let branch = project.branch(job.ref.branch || 'master');
                if (!branch) {
                    return debug('job.prepare - branch not found', job.ref.branch || 'master', project.name);
                }
                branch = branch.mirror_master ? project.branch('master') : branch;
                jjob.providerConfig = _.extend({}, project.provider.config, config.provider || {});
                config.runner = config.runner || branch.runner;
                if (!common.extensions.runner[config.runner.id]) {
                    debug(`Error: A job was registered for a runner that doesn't exist, i.e. "${config.runner.id}". This job will never run!`);
                }
                if (config) {
                    delete config.provider;
                    config = utils.mergeConfigs(branch, config);
                }
                emitter.emit('job.new', jjob, config);
                if (!mjob.runner)
                    mjob.runner = {};
                mjob.runner.id = config.runner.id;
                mjob
                    .save()
                    .then(() => debug('job saved'))
                    .catch((e) => debug(e));
            });
        });
    });
}
function BackChannel(emitter, ws) {
    this.ws = ws;
    this.users = {};
    this.public = {};
    this.waiting = {};
    emitter.on('job.prepare', prepareJob.bind(null, emitter));
    emitter.on('job.new', this.newJob.bind(this));
    emitter.on('browser.update', this.onUpdate.bind(this));
    emitter.on('job.done', this.jobDone.bind(this, emitter));
    emitter.on('job.errored', this.jobErrored.bind(this, emitter));
}
BackChannel.prototype = {
    send: function (project, event, args) {
        if (this.users[project]) {
            this.ws.send(this.users[project], [event, args, 'yours']);
        }
        if (this.public[project]) {
            this.ws.sendPublic(this.users[project], [event, args, 'public']);
        }
    },
    sendJobs: function (project, event, args) {
        if (this.users[project]) {
            this.ws.sendEach(this.users[project], function (user) {
                return [
                    event,
                    args.map(function (job) {
                        job = _.assign({}, job);
                        job.project = _.assign({}, job.project);
                        job.project.access_level = User.projectAccessLevel(user, job.project);
                        return job;
                    }),
                    'yours',
                ];
            });
        }
        if (this.public[project]) {
            this.ws.sendPublic(this.users[project], [
                event,
                args.map(function (job) {
                    job = _.assign({}, job);
                    job.project = _.assign({}, job.project);
                    job.project.access_level = 0;
                    return job;
                }),
                'public',
            ]);
        }
    },
    newJob: function (job) {
        debug('new job was created');
        const name = job.project.name;
        this.waiting[name] = [];
        this.public[name] = job.project.public;
        async.parallel({
            collaborators(paraCallback) {
                User.collaborators(name, 0, function (err, users) {
                    paraCallback(err, users);
                });
            },
            admins(paraCallback) {
                User.admins(paraCallback);
            },
        }, (err, users) => {
            if (err)
                return debug('new job: Failed to query for users');
            if (!users.collaborators)
                return debug('new job: no users found');
            this.users[name] = [];
            users.collaborators.forEach((user) => {
                this.users[name].push(user._id.toString());
            });
            // also send to system admins
            users.admins.forEach((user) => {
                this.users[name].push(user._id.toString());
            });
            // Admins maybe collaborators, so unique the array
            this.users[name] = _.uniq(this.users[name]);
            const njob = jobs.small(job);
            njob.project = utils.sanitizeProject(job.project);
            this.sendJobs(name, 'job.new', [njob]);
            const waiting = this.waiting[name];
            if (Array.isArray(waiting)) {
                waiting.forEach((item) => {
                    this.send(...[name].concat(item));
                });
            }
            delete this.waiting[name];
        });
    },
    // [project name, event name, [list of arguments]]
    onUpdate: function (project, event, args) {
        if (this.waiting[project]) {
            return this.waiting[project].push([event, args]);
        }
        this.send(project, event, args);
        if (event === 'job.status.started') {
            Job.findById(args[0], function (err, job) {
                if (err)
                    return debug('[backchannel][job.status.started] error getting job', args[0], err);
                if (!job)
                    return debug('[backchannel][job.status.started] job not found', args[0]);
                job.started = args[1];
                job.save();
            });
        }
    },
    jobDone: function (emitter, data) {
        Job.findById(data.id, (err, job) => {
            if (err)
                return debug('Error finding job', err.message);
            if (!job)
                return debug('job.done but job not found:', data.id);
            _.extend(job, data);
            try {
                job.duration = data.finished.getTime() - data.started.getTime();
            }
            catch (ignore) {
                job.duration = 1;
            }
            job.markModified('phases');
            job.markModified('plugin_data');
            job.test_exitcode = job.phases.test && job.phases.test.exitCode;
            job.deploy_exitcode = job.phases.deploy && job.phases.deploy.exitCode;
            job.save();
            job = job.toJSON();
            Project.findOne({ name: job.project })
                .lean()
                .exec((err, project) => {
                if (err)
                    return debug('Error finding project for job', err.message, job.project);
                if (!project)
                    return debug('Project for job.done not found', job.project);
                job.project = utils.sanitizeProject(project);
                job.status = jobs.status(job);
                this.sendJobs(project.name, 'job.done', [job]);
                emitter.emit('job.doneAndSaved', job);
            });
        });
    },
    jobErrored: function (emitter, data) {
        Job.findById(data.id, (err, job) => {
            if (err)
                return debug('Error finding job', err.message);
            if (!job)
                return debug('job.done but job not found:', data.id);
            _.extend(job, data);
            try {
                job.duration = data.finished.getTime() - data.started.getTime();
            }
            catch (ignore) {
                job.duration = 1;
            }
            job.markModified('phases');
            job.markModified('plugin_data');
            job.test_exitcode = job.phases.test && job.phases.test.exitCode;
            job.deploy_exitcode = job.phases.deploy && job.phases.deploy.exitCode;
            job.save();
            job = job.toJSON();
            Project.findOne({ name: job.project })
                .lean()
                .exec((err, project) => {
                if (err)
                    return debug('Error finding project for job', err.message, job.project);
                if (!project)
                    return debug('Project for job.done not found', job.project);
                job.project = utils.sanitizeProject(project);
                job.status = jobs.status(job);
                this.sendJobs(project.name, 'job.errored', [job]);
                emitter.emit('job.doneAndSaved', job);
            });
        });
    },
};
module.exports = BackChannel;
//# sourceMappingURL=backchannel.js.map