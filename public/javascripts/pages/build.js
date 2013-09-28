
/* globals JobMonitor: true, console: true, io: true */

function BuildPage(socket, change) {
  JobMonitor.call(this, socket, change);
  this.jobs = {};
}

_.extend(BuildPage.prototype, JobMonitor.prototype, {
  emits: {
    getUnknown: 'build:job'
  },
  job: function (id, access) {
    return this.jobs[id];
  },
  addJob: function (job, access) {
    this.jobs[job._id] = job;
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

// main jobs controller
app.controller('JobCtrl', ['$scope', '$route', '$location', function ($scope, $route, $location) {
  var params = $route.current ? $route.current.params : {}
    , project = window.project
    , jobid = params.id || window.jobs[0]._id
    , socket = window.socket || (window.socket || io.connect())
    , lastRoute = $route.current
    , jobman = new BuildPage(socket, $scope.$digest.bind($scope))

  $scope.phases = ['environment', 'prepare', 'test', 'deploy', 'cleanup'];
  $scope.project = project;
  $scope.jobs = window.jobs;
  $scope.job = window.job;

  $scope.sortDate = function (item) {
    if (!item.finished_timestamp) return new Date().getTime();
    return new Date(item.finished_timestamp).getTime();
  };

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
        $scope.job = job;
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
      icon: 'code',
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

  // button handlers
  $scope.startDeploy = function () {
    $('.tooltip').hide();
    socket.emit('deploy', project.name)
    $scope.job = {
      project: $scope.job.project,
      status: 'submitted'
    };
  };
  $scope.startTest = function () {
    $('.tooltip').hide();
    socket.emit('test', project.name)
    $scope.job = {
      project: $scope.job.project,
      status: 'submitted'
    };
  };

  // Socket update stuff
  var console = document.querySelector('.console-output');
}]);

