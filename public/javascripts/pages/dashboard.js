/* global JobMonitor: true, io: true */

var PHASES = ['environment', 'prepare', 'test', 'deploy', 'cleanup'];

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
  this.scope.jobs = this.jobs;
  this.scope.loadingJobs = true;
  this.sock.emit('dashboard:jobs', function (jobs) {
    $scope.jobs = jobs;
    $scope.loadingJobs = false;
    $scope.$digest();
  });
}

_.extend(Dashboard.prototype, JobMonitor.prototype, {
  job: function (id, access) {
    var jobs = this.jobs[access];
    for (var i=0; i<jobs.length; i++) {
      if (jobs[i]._id === id) return jobs[i];
    }
  },
  addJob: function (job, access) {
    var jobs = this.jobs[access]
      , found = -1
      , old;
    for (var i=0; i<jobs.length; i++) {
      if (jobs[i].project.name === job.project.name) {
        found = 1;
        break;
      }
    }
    if (found !== -1) {
      old = jobs.splice(found, 1);
      job.project.prev = old.project.prev;
    }
    if (job.phases) {
      // get rid of extra data - we don't need it.
      // note: this won't be passed up anyway for public projects
      cleanJob(job);
    }
    job.phase = 0;
    job.numphases = job.type === 'TEST_ONLY' ? 4 : 5;
    jobs.unshift(job);
  },
});

angular.module('dashboard', ['moment'], function ($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
}).controller('Dashboard', ['$scope', '$element', function ($scope, $element) {
  var socket = window.socket || (window.socket = io.connect())
    , dash = new Dashboard(socket, $scope);
  $scope.startDeploy = function (job) {
    $('.tooltip').hide();
    socket.emit('deploy', job.project.name)
  };
  $scope.startTest = function (job) {
    $('.tooltip').hide();
    socket.emit('test', job.project.name)
  };
}]);

