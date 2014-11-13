'use strict';

var _ = require('lodash');
var bootbox = require('bootbox');
var $ = require('jquery');
var io = require('socket.io-client');
var JobDataMonitor = require('../../utils/job-data-monitor');
var PHASES = require('../../utils/phases');
var SKELS = require('../../utils/skels');
var job = global.job;
var runtime = null;
var outputConsole;

module.exports = function ($scope, $route, $location, $filter) {
  var params = $route.current ? $route.current.params : {}
    , project = global.project
    , jobid = params.id || (global.job && global.job._id)
    , socket = io.connect()
    , lastRoute = $route.current
    , jobman = new BuildPage(socket, project.name, $scope.$digest.bind($scope), $scope, global.jobs, global.job)

  outputConsole = global.document.querySelector('.console-output');
  $scope.phases = PHASES;
  $scope.project = project;
  $scope.jobs = global.jobs;
  $scope.job = global.job;
  $scope.canAdminProject = global.canAdminProject
  $scope.showStatus = global.showStatus;
  $scope.tabIcon = function (phase) {
    if (!phase) {
      return'fa-circle-o';
    }

    if (phase.running || (phase.started && !phase.finished)) {
      return 'fa-spin fa-gear';
    }

    if (phase.queued) {
      return 'fa-circle';
    }
    else {
      if (phase.finished) {
        if (phase.exitCode === 0) {
          return 'fa-check-circle success-text';
        }
        else {
          return 'fa-exclamation-circle failure-text';
        }
      }

      return 'fa-circle-o';
    }
  };

  if ($scope.job && $scope.job.phases.test.commands.length) {
    setupPhases(job.phases, 'test');
  }

  function setupPhases(phases, type) {
    _.forEach(phases, function (phase, name) {
      if (type === 'test' && name === 'deploy') {
        return;
      }

      if (PHASES.indexOf(name) === 0) {
        if (!phase.finished) {
          phase.running = true;
        }
      }
      else {
        if (!phase.finished && !phase.running) {
          phase.queued = true;
        }
      }
    }); 
  }

  /*
  var now = new Date().getTime()
  $scope.sortDate = function (item) {
    if (!item.finished) return new Date().getTime();
    return new Date(item.finished).getTime();
  };
  */

  $scope.toggleErrorDetails = function () {
    if ($scope.showErrorDetails) {
      $scope.showErrorDetails = false;
    }
    else {
      $scope.showErrorDetails = true;
    }
  };

  $scope.clearCache = function () {
    $scope.clearingCache = true;
    $.ajax('/' + $scope.project.name + '/cache/' + $scope.job.ref.branch, {
      type: 'DELETE',
      success: function () {
        $scope.clearingCache = false;
        $scope.$digest();
      },
      error: function () {
        $scope.clearingCache = false;
        $scope.$digest();
        bootbox.alert('Failed to clear the cache');
      }
    });
  }

  $scope.$on('$locationChangeSuccess', function(event) {
    if (global.location.pathname.match(/\/config$/)) {
      global.location = global.location;
      return;
    }
    params = $route.current.params;
    if (!params.id) params.id = $scope.jobs[0]._id;
    // don't refresh the page
    $route.current = lastRoute;
    if (jobid !== params.id) {
      jobid = params.id;
      var cached = jobman.get(jobid, function (err, job, cached) {
        setupPhases(job.phases, 'test');
        $scope.job = job;
        if ($scope.job.phases.test.commands.length) {
          setupPhases(job.phases, 'test');
        }
        if (!cached) $scope.$digest();
      });
      if (!cached) {
        for (var i=0; i<$scope.jobs.length; i++) {
          if ($scope.jobs[i]._id === jobid) {
            $scope.job = $scope.jobs[i];
            break;
          }
        }
      }
    }
  });

  $scope.triggers = {
    commit: {
      icon: 'code-fork',
      title: 'Commit'
    },
    manual: {
      icon: 'hand-o-right',
      title: 'Manual'
    },
    plugin: {
      icon: 'puzzle-piece',
      title: 'Plugin'
    },
    api: {
      icon: 'cloud',
      title: 'Cloud'
    }
  };

  // shared templates ; need to know what to show
  $scope.page = 'build';
  // a history item is clicked
  $scope.selectJob = function (id) {
    $location.path('/job/' + id).replace();
  };

  // set the favicon according to job status
  $scope.$watch('job.status', function (value) {
    updateFavicon(value);
  });

  buildSwitcher($scope);

  $scope.$watch('job.std.merged_latest', function (value) {
    /* Tracking isn't quite working right
    if ($scope.job.status === 'running') {
      height = outputConsole.getBoundingClientRect().height;
      tracking = height + outputConsole.scrollTop > outputConsole.scrollHeight - 50;
      // console.log(tracking, height, outputConsole.scrollTop, outputConsole.scrollHeight);
      if (!tracking) return;
    }
    */
    var ansiFilter = $filter('ansi')
    $('.job-output').last().append(ansiFilter(value))
    outputConsole.scrollTop = outputConsole.scrollHeight;
    setTimeout(function () {
      outputConsole.scrollTop = outputConsole.scrollHeight;
    }, 10);
  });
  // button handlers
  $scope.startDeploy = function (job) {
    $('.tooltip').hide();
    socket.emit('deploy', project.name, job && job.ref.branch)
    $scope.job = {
      project: $scope.job.project,
      status: 'submitted'
    };
  };
  $scope.startTest = function (job) {
    $('.tooltip').hide();
    socket.emit('test', project.name, job && job.ref.branch)
    $scope.job = {
      project: $scope.job.project,
      status: 'submitted'
    };
  };
  $scope.cancelJob = function (id) {
    socket.emit('cancel', id)
  };
};

function BuildPage(socket, project, change, scope, jobs, job) {
  JobDataMonitor.call(this, socket, change);
  this.scope = scope;
  this.project = project;
  this.jobs = {};
  this.jobs[job._id] = job
}

_.extend(BuildPage.prototype, JobDataMonitor.prototype, {
  emits: {
    getUnknown: 'build:job'
  },
  job: function (id, access) {
    return this.jobs[id];
  },
  addJob: function (job, access) {
    if ((job.project.name || job.project) !== this.project) return;
    this.jobs[job._id] = job;
    var found = -1
      , i;
    for (i=0; i<this.scope.jobs.length; i++) {
      if (this.scope.jobs[i]._id === job._id) {
        found = i;
        break;
      }
    }
    if (found !== -1) {
      this.scope.jobs.splice(found, 1);
    }
    if (!job.phase) job.phase = 'environment';
    if (!job.std) {
      job.std = {
        out: '',
        err: '',
        merged: ''
      }
    }
    if (!job.phases) {
      job.phases = {};

      for (i = 0; i < PHASES.length; i++) {
        job.phases[PHASES[i]] = _.cloneDeep(SKELS.phase);
      }

      job.phases[job.phase].started = new Date();
      job.phases[job.phase].running = true;
    } else {
      if (job.phases.test.commands.length) {
        setupPhases(job.phases, 'test');
      }
    }

    this.scope.jobs.unshift(job);
    this.scope.job = job;
  },
  get: function (id, done) {
    if (this.jobs[id]) {
      done(null, this.jobs[id], true);
      return true;
    }
    var self = this;
    this.sock.emit('build:job', id, function (job) {
      self.jobs[id] = job;
      done(null, job);
    });
  }
});

/** manage the favicons **/
function setFavicon(status) {
  $('link[rel*="icon"]').attr('href', '/images/icons/favicon-' + status + '.png');
}

function animateFav() {
  var alt = false;
  function switchit() {
    setFavicon('running' + (alt ? '-alt' : ''));
    alt = !alt;
  }
  return setInterval(switchit, 500);
}

function updateFavicon(value) {
  if (value === 'running') {
    if (runtime === null) {
      runtime = animateFav();
    }
  } else {
    if (runtime !== null) {
      clearInterval(runtime);
      runtime = null;
    }
    setFavicon(value);
  }
}

function buildSwitcher($scope) {
  function switchBuilds(evt) {
    var dy = {40: 1, 38: -1}[evt.keyCode]
      , id = $scope.job._id
      , idx;
    if (!dy) return;
    for (var i=0; i<$scope.jobs.length; i++) {
      if ($scope.jobs[i]._id === id) {
        idx = i;
        break;
      }
    }
    if (idx === -1) {
      console.log('Failed to find job.');
      return global.location = global.location
    }
    idx += dy;
    if (idx < 0 || idx >= $scope.jobs.length) {
      return;
    }
    evt.preventDefault();
    $scope.selectJob($scope.jobs[idx]._id);
    $scope.$root.$digest();
  }
  global.document.addEventListener('keydown', switchBuilds);
}
