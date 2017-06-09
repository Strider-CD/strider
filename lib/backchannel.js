'use strict';

/*
 * Backchannel server allows workers to stream messages back to the Node server
 * in a line-buffered way. Uses SSL.
 */

var _ = require('lodash');
var async = require('async');
var common = require('./common');
require('./config');
var debug = require('debug')('strider:backchannel');
var jobs = require('./jobs');
var models = require('./models');
var utils = require('./utils');

var Job = models.Job;
var User = models.User;
var Project = models.Project;

async function striderJson(provider, project, environment) {
  function finished(err, contents) {
    if (err || !contents) return done(err);

    var data = {};

    try {
      data = JSON.parse(contents);
    } catch (e) {
      debug('Strider config is invalid JSON for', project, ref);
      debug(contents);
    }

    done(undefined, data);
  }

  if (!provider.hosted) {
    return provider.getFile('strider.json', ref, project.provider.config, project, finished);
  }

  var account = project.creator.account(project.provider.id, project.provider.account);

  provider.getFile('strider.json', ref, account.config, project.provider.config, project, finished);
}

/**
 * Prepare the job for execution, save to database, and fire off a `job.new` event.
 *
 * jobHash is expected to be populated with:
 * - a trigger
 * - a ref
 * - the project name
 * - the user id (if applicable)
 * - type
 * - created timestamp
 *
 */
async function prepareJob(emitter, jobHash) {
  let project;

  try {
    project = await Project.findOne({ name: jobHash.project }).populate('creator');
  } catch(err) {
    return debug('job.prepare - failed to get project', jobHash.project, err);
  }

  // ok so the project is real, we can go ahead and save this job
  let provider = common.extensions.provider[project.provider.id];

  if (!provider) {
    return debug('job.prepare - provider not found for project', jobHash.project, project.provider.id);
  }

  let job;

  try {
    job = await Job.create(jobHash);
  } catch(err) {
    return debug('job.prepare - failed to save job', jobHash, err);
  }

  let jobJson = job.toJSON();

  jobJson.project = project;
  jobJson.providerConfig = project.provider.config;
  jobJson.fromStriderJson = true;

  let environment = await project.environment(jobHash.environmentId);

  if (!environment) {
    return debug('job.prepare - environment not found', jobHash.environmentId, project.name);
  }

  let config;
  
  try {
    config = striderJson(provider, project, environment);
  } catch(err) {
    if (err.status === 403 || err.statusCode === 403) {
      debug('job.prepare - access to strider.json is forbidden, skipping config merge');
    } else if (err.status === 404 || err.statusCode === 404) {
      debug('job.prepare - strider.json not found, skipping config merge');
    } else {
      debug('job.prepare - error opening/processing project\'s `strider.json` file: ', err);
    }

    config = {};
    jobJson.fromStriderJson = false;
  }

  debug('Using configuration from "strider.json".');

  jobJson.providerConfig = _.extend({}, project.provider.config, config.provider || {});
  config.runner = config.runner || environment.runner;

  if (!common.extensions.runner[config.runner.id]) {
    debug(`Error: A job was registered for a runner that doesn't exist, i.e. "${config.runner.id}". This job will never run!`);
  }

  if (config) {
    delete config.provider;
    config = utils.mergeConfigs(environment, config);
  }

  emitter.emit('job.new', jobJson, config);

  if (!job.runner) {
    job.runner = {};
  }

  job.runner.id = config.runner.id;

  try {
    await job.save();
    debug('job saved');
  } catch(err) {
    debug('job sav error', err);
  }
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
        return [event, args.map(function (job) {
          job = _.assign({}, job);
          job.project = _.assign({}, job.project);
          job.project.access_level = User.projectAccessLevel(user, job.project);
          return job;
        }), 'yours'];
      });
    }
    if (this.public[project]) {
      this.ws.sendPublic(this.users[project], [event, args.map(function (job) {
        job = _.assign({}, job);
        job.project = _.assign({}, job.project);
        job.project.access_level = 0;
        return job;
      }), 'public']);
    }
  },

  newJob: function (job) {
    debug('new job was created');
    var self = this;
    var name = job.project.name;

    this.waiting[name] = [];
    this.public[name] = job.project.public;

    async.parallel({
      collaborators: function (paraCallback) {
        User.collaborators(name, 0, function (err, users) {
          paraCallback(err, users);
        });
      },

      admins: function (paraCallback) {
        User.admins(paraCallback);
      }
    }, function (err, users) {
      if (err) return debug('new job: Failed to query for users');
      if (!users.collaborators) return debug('new job: no users found');
      self.users[name] = [];

      users.collaborators.forEach(function (user) {
        self.users[name].push(user._id.toString());
      });
      // also send to system admins
      users.admins.forEach(function (user) {
        self.users[name].push(user._id.toString());
      });

      // Admins maybe collaborators, so unique the array
      self.users[name] = _.uniq(self.users[name]);

      var njob = jobs.small(job);

      njob.project = utils.sanitizeProject(job.project);
      self.sendJobs(name, 'job.new', [njob]);

      var waiting = self.waiting[name];
      if (Array.isArray(waiting)) {
        waiting.forEach(function (item) {
          self.send.apply(self, [name].concat(item));
        });
      }
      delete self.waiting[name];
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
        if (err) return debug('[backchannel][job.status.started] error getting job', args[0], err);
        if (!job) return debug('[backchannel][job.status.started] job not found', args[0]);
        job.started = args[1];
        job.save();
      });
    }
  },
  jobDone: function (emitter, data) {
    var self = this;
    Job.findById(data.id, function (err, job) {
      if (err) return debug('Error finding job', err.message);
      if (!job) return debug('job.done but job not found:', data.id);
      _.extend(job, data);
      try {
        job.duration = data.finished.getTime() - data.started.getTime();
      } catch (ignore) {
        job.duration = 1;
      }
      job.markModified('phases');
      job.markModified('plugin_data');
      job.test_exitcode = job.phases.test && job.phases.test.exitCode;
      job.deploy_exitcode = job.phases.deploy && job.phases.deploy.exitCode;
      job.save();
      job = job.toJSON();

      Project.findOne({name: job.project}).lean().exec(function (err, project) {
        if (err) return debug('Error finding project for job', err.message, job.project);
        if (!project) return debug('Project for job.done not found', job.project);

        job.project = utils.sanitizeProject(project);
        job.status = jobs.status(job);
        self.sendJobs(project.name, 'job.done', [job]);
        emitter.emit('job.doneAndSaved', job);
      });
    });
  }
};

module.exports = BackChannel;
