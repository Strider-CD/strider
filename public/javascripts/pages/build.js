
/* globals JobDataMonitor: true, bootbox: true, console: true, io: true, PHASES: true, SKELS: true, job: true */

function jobSort(a, b) {
  if (a.nojobs) {
    if (b.nojobs) return 0
    return -1
  }
  if (b.nojobs) return 1
  if (a.status === 'running') {
    if (b.status === 'running') return 0
    return -1
  }
  if (b.status === 'running') return 1
  if (a.status === 'submitted') {
    if (b.status === 'submitted') return 0
    return -1
  }
  if (b.status === 'submitted') return 1
  if (!a.finished || !a.finished.getTime) return -1
  if (!b.finished || !b.finished.getTime) return 1
  return b.finished.getTime() - a.finished.getTime()
}

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
      for (i=0; i<PHASES.length; i++) {
        job.phases[PHASES[i]] = _.cloneDeep(SKELS.phase);
      }
      job.phases[job.phase].started = new Date()
    } else {
      if (job.phases.test.commands.length) {
        if (job.phases.environment) {
          job.phases.environment.collapsed = true;
        }
        if (job.phases.prepare) {
          job.phases.prepare.collapsed = true;
        }
        if (job.phases.cleanup) {
          job.phases.cleanup.collapsed = true;
        }
      }
    }
    this.scope.jobs.unshift(job);
    // this.scope.jobs.sort(jobSort);
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

var outputConsole;

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

var runtime = null;
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
      return window.location = window.location
    }
    idx += dy;
    if (idx < 0 || idx >= $scope.jobs.length) {
      return;
    }
    evt.preventDefault();
    $scope.selectJob($scope.jobs[idx]._id);
    $scope.$root.$digest();
  }
  document.addEventListener('keydown', switchBuilds);
}

var app = angular.module('JobStatus', ['moment', 'ansi', 'ngRoute']);
app.config(['$interpolateProvider', '$locationProvider', '$routeProvider', function (interp, location, route) {
  interp.startSymbol('[[');
  interp.endSymbol(']]');
  var one = {
    controller: 'JobCtrl',
    templateUrl: 'build-tpl.html'
  };
  var routes = {
    '/': one,
    '/job/latest': one,
    '/job/:id': one
  };
  Object.keys(routes).forEach(function (path) {
    route.when(path, routes[path]);
  });
  // route.otherwise({redirectTo: '/'});
  location.html5Mode(true);
}]);

function scrollSeen(item, parent) {
  if (item.offsetTop < parent.scrollTop) {
    return item.scrollIntoView(true);
  }
  if (item.offsetTop + item.offsetHeight > parent.scrollTop + parent.offsetHeight) {
    return item.scrollIntoView(false);
  }
}

app.directive('pluginStatus', function () {
  return {
    restrict: 'A',
    scope: {},
    link: function (scope, element, attrs) {
      scope.$parent.$watch('job.plugin_data["' + attrs.pluginStatus + '"]', function (value) {
        scope.data = value;
      });
      scope.$parent.$watch('showStatus[job.ref.branch]["' + attrs.pluginStatus + '"]', function (value) {
        scope.show = value;
      });
      scope.$parent.$watch('job', function (value) {
        scope.job = value;
      });
    }
  };
});

// main jobs controller
app.controller('JobCtrl', ['$scope', '$route', '$location', '$filter', function ($scope, $route, $location, $filter) {
  var params = $route.current ? $route.current.params : {}
    , project = window.project
    , jobid = params.id || (window.job && window.job._id)
    , socket = window.socket || (window.socket || io.connect())
    , lastRoute = $route.current
    , jobman = new BuildPage(socket, project.name, $scope.$digest.bind($scope), $scope, window.jobs, window.job)

  outputConsole = document.querySelector('.console-output');
  $scope.phases = ['environment', 'prepare', 'test', 'deploy', 'cleanup'];
  $scope.project = project;
  $scope.jobs = window.jobs;
  $scope.job = window.job;
  $scope.showStatus = window.showStatus;
  if ($scope.job && $scope.job.phases.test.commands.length) {
    if (job.phases.environment) {
      job.phases.environment.collapsed = true;
    }
    if (job.phases.prepare) {
      job.phases.prepare.collapsed = true;
    }
    if (job.phases.cleanup) {
      job.phases.cleanup.collapsed = true;
    }
  }

  /*
  var now = new Date().getTime()
  $scope.sortDate = function (item) {
    if (!item.finished) return new Date().getTime();
    return new Date(item.finished).getTime();
  };
  */

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
    if (window.location.pathname.match(/\/config$/)) {
      window.location = window.location;
      return;
    }
    params = $route.current.params;
    if (!params.id) params.id = $scope.jobs[0]._id;
    // don't refresh the page
    $route.current = lastRoute;
    if (jobid !== params.id) {
      jobid = params.id;
      var cached = jobman.get(jobid, function (err, job, cached) {
        if (job.phases.environment) {
          job.phases.environment.collapsed = true;
        }
        if (job.phases.prepare) {
          job.phases.prepare.collapsed = true;
        }
        if (job.phases.cleanup) {
          job.phases.cleanup.collapsed = true;
        }
        $scope.job = job;
        if ($scope.job.phases.test.commands.length) {
          $scope.job.phases.environment.collapsed = true;
          $scope.job.phases.prepare.collapsed = true;
          $scope.job.phases.cleanup.collapsed = true;
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
      icon: 'hand-right',
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

}]);

