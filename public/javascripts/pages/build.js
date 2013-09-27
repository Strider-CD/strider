
// instead of "about %d hours"
$.timeago.settings.strings.hour = 'an hour';
$.timeago.settings.strings.hours = '%d hours';
$.timeago.settings.localeTitle = true;

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

var app = angular.module('JobStatus', ['moment', 'ngRoute'], ['$interpolateProvider', '$locationProvider', '$routeProvider', function (interp, location, route) {
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

app.run(['$location', function($location) {

  console.log($location.path());
  /*
  if (location.pathname !== '/')
    $location.path(location.pathname);
    */

}])

// tooltip directive
app.directive("toggle", function($compile) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      if (attrs.toggle !== 'tooltip') return;
      setTimeout(function() {
        $(element).tooltip();
      }, 0);
    }
  };
})

function getDate(a) {
  if (!a.finished_timestamp) return new Date().getTime();
  return new Date(a.finished_timestamp).getTime();
}

/*
function sortByFinished(a, b) {
  a = getDate(a);
  b = getDate(b);
  if (a > b) return -1;
  if (b > a) return 1;
  return 0;
}

*/

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
    , jobs = window.jobs
    , jobid = params.id || jobs[0]._id
    , lastRoute = $route.current;

  $scope.phases = ['environment', 'prepare', 'test', 'deploy', 'cleanup'];
  $scope.project = project;
  $scope.jobs = jobs;
  $scope.job = jobs[0];

  setJob(project.name, params.id);

  $scope.sortDate = function (item) {
    if (!item.finished_timestamp) return new Date().getTime();
    return new Date(item.finished_timestamp).getTime();
  };

  $scope.$on('$locationChangeSuccess', function(event) {
    params = $route.current.params;
    if (!params.id) params.id = jobs[0]._id;
    if (window.location.pathname.split('/').slice(-1)[0] === 'config') {
      window.location = window.location;
      return;
    }
    // don't refresh the page
    $route.current = lastRoute;
    if (jobid !== params.id) {
      jobid = params.id;
      setJob(params.id);
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

  // $scope.jobs = jobman.getCache(project);
  var listContainer = document.getElementById('list-of-builds');
  function setJob(id) {
    for (var i=0; i<jobs.length; i++) {
      if (jobs[i]._id === id) {
        $scope.job = jobs[i];
        return;
      }
    }
    $scope.job = $scope.jobs[0];
  }
  
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

  $scope.$watch('job.output', function (value) {
    if ($scope.job && $scope.job.status === 'running') {
      return;
    }
    console.scrollTop = console.scrollHeight;
    setTimeout(function () {
      console.scrollTop = console.scrollHeight;
    }, 10);
  });

  var switchBuilds = function (evt) {
    var dy;
    if (evt.keyCode === 40) {
      dy = 1;
    } else if (evt.keyCode === 38) {
      dy = -1;
    } else {
      return;
    }
    var idx = $scope.jobs.indexOf($scope.job);
    if (idx === -1) {
      for (var i=0; i<$scope.jobs.length; i++) {
        if ($scope.jobs[i]._id === $scope.job._id) {
          idx = i;
          break;
        }
      }
    }
    if (idx === -1) {
      console.log('Failed to find job. resorting to id matching');
      return window.location = window.location
    }
    idx += dy;
    if (idx < 0 || idx >= $scope.jobs.length) {
      return;
    }
    // $scope.job = $scope.jobs[idx];
    var id = $scope.jobs[idx]._id;
    $scope.selectJob(id);
    evt.preventDefault();
    $scope.$root.$digest();
  };

  document.addEventListener('keydown', switchBuilds);

  function newJob(mode) {
    if ($scope.job.status === 'running' ||
        $scope.job.status === 'submitted') return;
    startJob($scope.job.project, mode);
    $scope.job = {
      project: $scope.job.project,
      status: 'submitted'
    };
  }

  // button handlers
  $scope.startTest = newJob.bind(null, 'TEST_ONLY');
  $scope.startDeploy = newJob.bind(null, 'TEST_AND_DEPLOY');

  // Socket update stuff
  var console = document.querySelector('.console-output');

  var jobtimers = {};
  function startJobTimer(id) {
    if (jobtimers[id]) return;
    jobtimers[id] = setInterval(function () {
      var job = $scope.jobs.ids[id];
      job.duration = parseInt((new Date().getTime()-new Date(job.created_timestamp).getTime())/1000);
      $scope.$digest();
    }, 500);
  }
  function clearJobTimer(id) {
    if (!jobtimers[id]) return;
    clearInterval(jobtimers[id]);
    jobtimers[id] = null
  }
  /*
  io.connect().on('new', function (data) {
    if (data.repo_url != repo.url) return;
    data.past_duration = $scope.jobs[0].duration;
    data.duration = 0;
    data.output = '';
    // $scope.job = jobman.update(project, data);
    startJobTimer(data._id);
    jobid = data._id;
    // $location.path('/' + project + '/job/' + jobid);
    $scope.$root.$digest();
  }).on('update', function (data) {
    if (data.repo_url != repo.url) return;
    if (!$scope.jobs.ids[data._id]) {
      var d = new Date().getTime();
      /* $scope.job = jobman.update(project, {
        id: data._id,
        repo_url: $scope.job.repo_url,
        created_timestamp: new Date(d - data.time_elapsed*1000),
        status: 'running',
        output: '',
        past_duration: 30,
        duration: parseInt(data.time_elapsed)
      }); 
      if ($scope.jobs[1]) {
        $scope.job.past_duration = $scope.jobs[1].duration;
      }
    }
    startJobTimer(data._id);
    // $scope.jobs.ids[data.id].duration = parseInt(data.time_elapsed);
    var job = $scope.jobs.ids[data.id];
    if (!job.past_duration && $scope.jobs[0]) {
      job.past_duration = $scope.jobs[0].duration;
    }
    if (data.msg[0] === '\r') {
      job.output = job.output.slice(0, job.output.lastIndexOf('\n') + 1);
      data.msg = data.msg.slice(1);
    }
    job.output += data.msg;
    job.time_elapsed = data.time_elapsed;
    var height, tracking = false;
    if (job.id === jobid) {
      // scroll when you want to, not when you don't
      height = console.getBoundingClientRect().height;
      tracking = height + console.scrollTop > console.scrollHeight - 20;
    }
    $scope.$digest();
    if (tracking) {
      console.scrollTop = console.scrollHeight;
    }
  }).on('done', function(data) {
    if (data.repo_url != repo.url) return;
    clearJobTimer(data.id);
    // $scope.job = jobman.update(project, data);
    $scope.$digest();
    // window.location = window.location;
  });
  */
}]);

function startJob(url, job_type, next) {
  var data = {url:url, type:job_type};
  setFavicon('running');

  $.ajax("/api/jobs/start", {
    data: data,
    dataType: "json",
    error: function(xhr, ts, e) {
      var job = JobList.find(function(item) {
        return item.get('repo_url') === url;
      });
      if (job !== undefined) {
        // ?? what's this ??
        // startProgressMeter(job);
      }
    },
    success: function(data, ts, xhr) {

    },
    type: "POST"
  });
};
