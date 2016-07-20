'use strict';

var $ = require('jquery');
var _ = require('lodash');
var io = require('socket.io-client');
var JobMonitor = require('../../utils/job-monitor');
var statusClasses = require('../../utils/status-classes');

module.exports = function ($scope) {
  var socket = io.connect();
  new Dashboard(socket, $scope);

  $scope.statusClasses = statusClasses;
  $scope.providers = global.providers;
  $scope.phases = ['environment', 'prepare', 'test', 'deploy', 'cleanup'];
  $('#dashboard').show();
  $scope.startDeploy = function (job) {
    $('.tooltip').hide();
    var branchToUse = determineTargetBranch(job);
    socket.emit('deploy', job.project.name, branchToUse);
  };
  $scope.startTest = function (job) {
    $('.tooltip').hide();
    var branchToUse = determineTargetBranch(job);
    socket.emit('test', job.project.name, branchToUse);
  };
  $scope.cancelJob = function (id) {
    socket.emit('cancel', id);
  };
};

/**
 * Given a job, returns a branch name that should be used for a deployment or test action.
 * @param {Object} job The job for which to determine the target branch.
 * @returns {String} If a reference build is defined, returns the name of the branch of the reference build; "master" otherwise.
 */
function determineTargetBranch(job) {
  return job.ref ? job.ref.branch : 'master';
}

function cleanJob(job) {
  delete job.phases;
  delete job.std;
  delete job.stdout;
  delete job.stderr;
  delete job.stdmerged;
  delete job.plugin_data;
}

// Events we care about:
// - job.new (job, access)
// - job.done (job, access)
// - browser.update (event, args, access)
function Dashboard(socket, $scope) {
  JobMonitor.call(this, socket, $scope.$digest.bind($scope));
  this.scope = $scope;
  this.scope.loadingJobs = false;
  this.scope.jobs = global.jobs;
}

_.extend(Dashboard.prototype, JobMonitor.prototype, {
  job: function (id, access) {
    var jobs = this.scope.jobs[access];
    for (var i = 0; i < jobs.length; i++) {
      if (jobs[i]._id === id) return jobs[i];
    }
  },
  addJob: function (job, access) {
    var jobs = this.scope.jobs[access];
    var found = -1;

    for (var i = 0; i < jobs.length; i++) {
      if (jobs[i].project.name === job.project.name) {
        found = i;
        break;
      }
    }
    if (found !== -1) {
      var old = jobs.splice(found, 1)[0];
      job.project.prev = old.project.prev;
    }
    if (job.phases) {
      // get rid of extra data - we don't need it.
      // note: this won't be passed up anyway for public projects
      cleanJob(job);
    }
    job.phase = 'environment';
    jobs.unshift(job);
  }
});

Dashboard.prototype.statuses['phase.done'] = function (data) {
  this.phase = data.next;
};
