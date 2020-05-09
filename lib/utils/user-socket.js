const gravatar = require('gravatar');
const models = require('../models');
const common = require('../common');
const jobs = require('../jobs');
const utils = require('../utils');
const Project = models.Project;
const User = models.User;
const Job = models.Job;

function UserSocket(userid) {
  this.userid = userid;
  this.sockets = [];
}

module.exports = UserSocket;

UserSocket.prototype = {
  add: function (socket) {
    const waiters = {};
    const self = this;

    for (const name in this.events) {
      socket.on(name, (waiters[name] = waiter(socket, name)).handler);
    }

    this.getUser(function () {
      for (const name in self.events) {
        unWait(socket, waiters[name], self.events[name].bind(self));
      }
    });

    this.sockets.push(socket);
  },

  remove: function (socket) {
    const idx = this.sockets.indexOf(socket);
    if (idx === -1) return false;
    this.sockets.splice(idx, 1);
    return true;
  },

  /**
   * Emit an even on all sockets
   */
  emit: function (args) {
    this.sockets.forEach(function (socket) {
      socket.emit.apply(socket, args);
    });
  },

  /**
   * Apply handlers for all sockets
   */
  on: function () {
    this.sockets.forEach(function (socket) {
      socket.on.apply(socket, arguments);
    });
  },

  getUser: function (done) {
    if (!this.userid) return done();
    const self = this;

    User.findById(this.userid, function (err, user) {
      if (err) console.error('failed to get user - socket', err);
      if (!user) {
        console.error(
          "user not found for the websocket - there's something strange going on w/ websocket auth. User Id: ",
          self.userid
        );
        self.emit(['auth.failed']);
        return;
      }
      self.user = user;
      done();
    });
  },

  events: {
    'dashboard:jobs': function (done) {
      jobs.latestJobs(this.user, function (err, jobs) {
        done(jobs);
      });
    },

    'dashboard:unknown': function (id, done) {
      const user = this.user;

      Job.findById(id)
        .lean()
        .exec(function (err, job) {
          if (err || !job)
            return console.error('[unknownjob] error getting job', id, err);
          Project.findOne({ name: job.project.toLowerCase() })
            .lean()
            .exec(function (err, project) {
              if (err || !project)
                return console.error(
                  '[unknownjob] error getting project',
                  id,
                  err
                );
              const njob = jobs.small(job);
              njob.project = utils.sanitizeProject(project);
              njob.project.access_level = User.projectAccessLevel(
                user,
                project
              );
              // this will be filled in
              njob.project.prev = [];
              done(njob);
            });
        });
    },

    'build:job': function (id, done) {
      const user = this.user;

      Job.findById(id)
        .lean()
        .exec(function (err, job) {
          if (err)
            return console.error(
              'Error retrieving job',
              id,
              err.message,
              err.stack
            );
          if (!job) return console.error('Job not found', id);

          Project.findOne({ name: job.project.toLowerCase() })
            .lean()
            .exec(function (err, project) {
              if (err || !project)
                return console.error('Error getting project', job.project, err);
              job.status = jobs.status(job);
              job.project = utils.sanitizeProject(project);
              job.project.access_level = User.projectAccessLevel(user, project);
              job.project.prev = [];
              done(job);
            });
        });
    },

    'build:unknown': function () {
      // TODO: query the responsible runner to get the current output, etc.
    },

    test: function (project, branch) {
      const user = this.user;

      startJob(project, user, branch, 'TEST_ONLY');
    },

    deploy: function (project, branch) {
      const user = this.user;

      startJob(project, user, branch, 'TEST_AND_DEPLOY');
    },

    cancel: function (id) {
      console.log('Got a request to cancel', id);
      const self = this;

      Job.findById(id)
        .lean()
        .exec(function (err, job) {
          if (err || !job)
            return console.error('[canceljob] error getting job', id, err);
          Project.findOne({ name: job.project.toLowerCase() })
            .lean()
            .exec(function (err, project) {
              if (err || !project)
                return console.error(
                  '[canceljob] error getting project',
                  id,
                  err
                );
              if (!job) return console.error('[canceljob] Job not found', id);
              if (User.projectAccessLevel(self.user, project) > 0) {
                common.emitter.emit('job.cancel', id);
              }
            });
        });
    },

    restart: function () {
      console.log('Implementation needed');
    },
  },
};

function waiter(socket, event) {
  var wait = {
    event: event,
    calls: [],
    handler: function () {
      wait.calls.push(arguments);
    },
  };
  return wait;
}

function unWait(socket, waiter, handler) {
  socket.removeListener(waiter.event, waiter.handler);
  socket.on(waiter.event, handler);
  for (let i = 0; i < waiter.calls.length; i++) {
    handler.apply(null, waiter.calls[i]);
  }
}

function kickoffJob(user, project, type, branch) {
  const now = new Date();
  let trigger;
  let job;

  branch = branch || 'master';

  trigger = {
    type: 'manual',
    author: {
      id: user._id,
      email: user.email,
      image: gravatar.url(user.email, {}, true),
      name: user.name,
    },
    message:
      type === 'TEST_AND_DEPLOY'
        ? 'Manually Redeploying'
        : 'Manually Retesting',
    timestamp: now,
    source: { type: 'UI', page: 'unknown' },
  };

  if (branch !== 'master') {
    trigger.message += ` ${branch}`;
  }

  job = {
    type: type,
    user_id: user._id,
    project: project,
    ref: { branch: branch },
    trigger: trigger,
    created: now,
  };

  common.emitter.emit('job.prepare', job);
}

function startJob(projectName, user, branch, jobType) {
  Project.findOne({ name: projectName })
    .lean()
    .exec(function (err, project) {
      if (User.projectAccessLevel(user, project) > 0) {
        kickoffJob(user, project.name, jobType, branch);
      }
    });
}
