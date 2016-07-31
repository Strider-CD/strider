'use strict';

var models = require('../models');
var common = require('../common');
var jobs = require('../jobs');
var utils = require('../utils');
var Project = models.Project;
var User = models.User;
var Job = models.Job;

function UserSocket(userid) {
  this.userid = userid;
  this.sockets = [];
}

module.exports = UserSocket;

UserSocket.prototype = {
  add: function (socket) {
    var waiters = {};
    var self = this;

    for (var name in this.events) {
      socket.on(name, (waiters[name] = waiter(socket, name)).handler);
    }

    this.getUser(function () {
      for (var name in self.events) {
        unWait(socket, waiters[name], self.events[name].bind(self));
      }
    });

    this.sockets.push(socket);
  },

  remove: function (socket) {
    var idx = this.sockets.indexOf(socket);
    if (idx === -1) return false;
    this.sockets.splice(idx, 1);
    return true;
  },

  // args are passed to an `apply` call on each socket
  emit: function (args) {
    for (var i = 0; i < this.sockets.length; i++) {
      this.sockets[i].emit.apply(this.sockets[i], args);
    }
  },

  on: function () {
    for (var i = 0; i < this.sockets.length; i++) {
      this.sockets[i].on.apply(this.sockets[i], arguments);
    }
  },

  getUser: function (done) {
    if (!this.userid) return done();
    var self = this;

    User.findById(this.userid, function (err, user) {
      if (err) console.error('failed to get user - socket', err);
      if (!user) {
        console.error('user not found for the websocket - there\'s something strange going on w/ websocket auth. User Id: ', self.userid);
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
      var user = this.user;

      Job.findById(id).lean().exec(function (err, job) {
        if (err || !job) return console.error('[unknownjob] error getting job', id, err);
        Project.findOne({name: job.project.toLowerCase()}).lean().exec(function (err, project) {
          if (err || !project) return console.error('[unknownjob] error getting project', id, err);
          var njob = jobs.small(job);
          njob.project = utils.sanitizeProject(project);
          njob.project.access_level = User.projectAccessLevel(user, project);
          // this will be filled in
          njob.project.prev = [];
          done(njob);
        });
      });
    },

    'build:job': function (id, done) {
      var user = this.user;

      Job.findById(id).lean().exec(function (err, job) {
        if (err) return console.error('Error retrieving job', id, err.message, err.stack);
        if (!job) return console.error('Job not found', id);

        Project.findOne({name: job.project.toLowerCase()}).lean().exec(function (err, project) {
          if (err || !project) return console.error('Error getting project', job.project, err);
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

    'test': function (project, branch) {
      var user = this.user;

      Project.findOne({name: project}).lean().exec(function (err, project) {
        if (User.projectAccessLevel(user, project) > 0) {
          kickoffJob(user, project.name, 'TEST_ONLY', branch);
        }
      });
    },

    'deploy': function (project, branch) {
      var user = this.user;

      Project.findOne({name: project}).lean().exec(function (err, project) {
        if (User.projectAccessLevel(user, project) > 0) {
          kickoffJob(user, project.name, 'TEST_AND_DEPLOY', branch);
        }
      });
    },

    'cancel': function (id) {
      console.log('Got a request to cancel', id);
      var self = this;

      Job.findById(id).lean().exec(function (err, job) {
        if (err || !job) return console.error('[canceljob] error getting job', id, err);
        Project.findOne({name: job.project.toLowerCase()}).lean().exec(function (err, project) {
          if (err || !project) return console.error('[canceljob] error getting project', id, err);
          if (!job) return console.error('[canceljob] Job not found', id);
          if (User.projectAccessLevel(self.user, project) > 0) {
            common.emitter.emit('job.cancel', id);
          }
        });
      });
    },

    'restart': function () {
      console.log('Implementation needed');
    }
  }
};

function waiter(socket, event) {
  var wait = {
    event: event,
    calls: [],
    handler: function () {
      wait.calls.push(arguments);
    }
  };
  return wait;
}

function unWait(socket, waiter, handler) {
  socket.removeListener(waiter.event, waiter.handler);
  socket.on(waiter.event, handler);
  for (var i = 0; i < waiter.calls.length; i++) {
    handler.apply(null, waiter.calls[i]);
  }
}
