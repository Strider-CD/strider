
// instead of "about %d hours"
$.timeago.settings.strings.hour = 'an hour';
$.timeago.settings.strings.hours = '%d hours';
$.timeago.settings.localeTitle = true;

/**
var running;
function runningAnimate(num) {
  num = num || 0;
  if (num > 9) num = 0;
  setFavicon('loading-' + num);
  running = setTimeout(function () {
    runningAnimate(num + 1);
  }, 100);
}
**/

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

var app = angular.module('JobStatus', [], ['$interpolateProvider', '$locationProvider', '$routeProvider', function (interp, location, route) {
  interp.startSymbol('[[');
  interp.endSymbol(']]');
  var one = {
    controller: 'JobCtrl',
    templateUrl: 'build-tpl.html'
  };
  var routes = {
    '/:org/:repo/': one,
    '/:org/:repo/latest_build': one,
    '/:org/:repo/job/:id': one
  };
  Object.keys(routes).forEach(function (path) {
    route.when(path, routes[path]);
  });
  route.otherwise({redirectTo: '/'});
  location.html5Mode(true);
}]);

app.run(['$location', function($location) {

  if (location.pathname !== '/')
    $location.path(location.pathname);

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

// timeago directive
app.directive("time", function() {
  return {
    restrict: "E",
    link: function(scope, element, attrs) {
      var date = new Date(attrs.datetime);
      $(element).tooltip({title: date.toLocaleString()});
      $(element).text($.timeago(date));
      setTimeout(function () {
        $(element).timeago();
      }, 0);
    }
  };
});

function getDate(a) {
  if (!a.finished_timestamp) return new Date().getTime();
  return new Date(a.finished_timestamp).getTime();
}

function sortByFinished(a, b) {
  a = getDate(a);
  b = getDate(b);
  if (a > b) return -1;
  if (b > a) return 1;
  return 0;
}

var JobManager = function () {
  this.cache = {};
  this.loading = {};
  this.waiting = {};
};

JobManager.prototype = {
  getCache: function (project) {
    if (!this.cache[project]) {
      this.cache[project] = {
        list: [],
        ids: {}
      };
    }
    return this.cache[project];
  },
  processJobs: function (project, jobs) {
    var cache = this.getCache(project);
    var ids = {};

    // here we extend if it's already there instead of replacing it
    // so that angular's watches will all work out.
    // actually not sure that we need to do this.
    for (var i=0; i<jobs.length; i++) {
      if (cache.ids[jobs[i].id]) {
        jobs[i] = ids[jobs[i].id] = $.extend(cache.ids[jobs[i].id], jobs[i]);
        ids[jobs[i].id]._sparse = false;
      } else {
        ids[jobs[i].id] = jobs[i];
      }
    }
    cache.ids = ids;
    jobs.sort(sortByFinished);
    cache.list = jobs;
    // we now have everything, not just the most recent
    cache.full = true;
  },
  getOutput: function (project, id, next) {
    var cache = this.getCache(project);
    if (cache.ids[id] && cache.ids[id].output && cache.ids[id].status !== 'running') {
      return next(null, cache.ids[id], true);
    }
    $.get('/api/job/' + id)
     .done(function (data) {
       if (!cache.ids[id]) {
         cache.ids[id] = {
           _sparse: true
         };
         cache.list.unshift(cache.ids[id]);
       }
       cache.ids[id].output = data;
       next && next(null, cache.ids[id], false);
     })
     .fail(function (xhr, status, err) {
       next && next(err);
     });
  },
  // got job data from somewhere else
  update: function (project, data) {
    var cache = this.getCache(project);
    if (cache.ids[data.id]) {
      return $.extend(cache.ids[data.id], data);
    }
    cache.list.unshift(data);
    cache.ids[data.id] = data;
    return data;
  },
  fetch: function (project, id, next) {
    var cache = this.getCache(project)
      , job = cache.ids[id];

    // get output
    if ((!job || !job.output) && id) {
      this.getOutput(project, id, next);
    }
    // get the whole job list if we don't have it
    if (!this.cache[project] || !this.cache[project].full) {
      if (!this.loading[project]) {
        // kick off the ajax call
        this.getJobs(project);
      }
      if (!job || job._sparse && next) {
        // we don't have the job, and we're still loading, so just
        // get on the list
        this.waiting[project].push([id, next]);
        return this;
      }
    }

    next && next(null, job, true);
    return this;
  },
  getJobs: function (project) {
    var self = this;
    if (this.loading[project]) {
      console.warn('Already loading', project, '!!!!', id, next);
      return;
    }
    this.loading[project] = true;
    this.waiting[project] = [];
    $.get('/api/jobs/' + project)
     .done(function (data) {
        var waiter;
        self.loading[project] = false;
        self.processJobs(data.project, data.jobs);
        // dispatch the waiting continuations
        while (waiter = self.waiting[project].shift()) {
          if (waiter[0]) {
            waiter[1](null, self.cache[project].ids[waiter[0]], false);
          } else { // give them the first one
            waiter[1](null, self.cache[project].list[0], false);
            // also get the output
            self.getOutput(project, self.cache[project].list[0].id, waiter[1]);
          }
        }
      })
      .error(function (xhr, status, err) {
        var waiter;
        self.loading[project] = false;
        // dispatch the waiting continuations
        while (waiter = self.waiting.shift()) {
          waiter[1](err);
        }
      });
  },
};

app.factory('jobs', function () {
  // job caching
  return new JobManager();
});

function scrollSeen(item, parent) {
  if (item.offsetTop < parent.scrollTop) {
    return item.scrollIntoView(true);
  }
  if (item.offsetTop + item.offsetHeight > parent.scrollTop + parent.offsetHeight) {
    return item.scrollIntoView(false);
  }
}

// main jobs controller
app.controller('JobCtrl', ['$scope', '$route', '$location', 'jobs', function ($scope, $route, $location, jobs) {

  var params = $route.current.params
    , jobid = params.id
    , project = params.org + '/' + params.repo
    , lastRoute = $route.current;

  setJob(project, params.id);

  $scope.repo = repo;

  $scope.sortDate = function (item) {
    if (!item.finished_timestamp) return new Date().getTime();
    return new Date(item.finished_timestamp).getTime();
  };

  $scope.$on('$locationChangeSuccess', function(event) {
    params = $route.current.params;
    if (params.org + '/' + params.repo == project) {
      // don't refresh the page
      $route.current = lastRoute;
      if (jobid !== params.id) {
        jobid = params.id;
        setJob(project, params.id);
      }
    } else if (window.location.pathname.split('/').slice(-1)[0] === 'config') {
      window.location = window.location;
    }
  });

  $scope.jobs = jobs.getCache(project);
  var listContainer = document.getElementById('list-of-builds');
  function setJob(project, id) {
    jobs.fetch(project, id, function (err, job, cached) {
      if (err) {
        return showError('Failed to fetch job');
      }
      if (jobid && job.id !== jobid) return;
      jobid = job.id;
      $scope.job = job;
      if (!cached) {
        $scope.$digest();
      }
      updateFavicon(job.status);
      var item = $('.build-list-item[data-id="' + job.id + '"]')[0];
      if (item) {
        scrollSeen(item, listContainer);
      } else {
        setTimeout(function () {
          var item = $('.build-list-item[data-id="' + job.id + '"]')[0];
          if (item) scrollSeen(item, listContainer);
        }, 100);
      }
    });
  }
  
  // shared templates ; need to know what to show
  $scope.page = 'build';
  // a history item is clicked
  $scope.selectJob = function (id) {
    $location.path('/' + params.org + '/' + params.repo + '/job/' + id).replace();
  };

  // set the favicon according to job status
  $scope.$watch('job.status', function (value) {
    updateFavicon(value);
  });

  $scope.$watch('job.output', function (value) {
    if ($scope.job && $scope.job.running) {
      return;
    }
    console.scrollTop = console.scrollHeight;
    setTimeout(function () {
      console.scrollTop = console.scrollHeight;
    }, 10);
  });

  // this will eventually be loaded by ajax too
  $scope.repo = window.repo;

  var switchBuilds = function (evt) {
    var dy;
    if (evt.keyCode === 40) {
      dy = 1;
    } else if (evt.keyCode === 38) {
      dy = -1;
    } else {
      return;
    }
    var idx = $scope.jobs.list.indexOf($scope.job);
    if (idx === -1) {
      // console.log('Failed to find job. resorting to id matching');
      for (var i=0; i<$scope.jobs.list.length; i++) {
        if ($scope.jobs.list[i].id === $scope.job.id) {
          idx = i;
          break;
        }
      }
    }
    idx += dy;
    if (idx < 0 || idx >= $scope.jobs.list.length) {
      return;
    }
    // $scope.job = $scope.jobs.list[idx];
    var id = $scope.jobs.list[idx].id;
    $scope.selectJob(id);
    evt.preventDefault();
    $scope.$root.$digest();
  };

  document.addEventListener('keydown', switchBuilds);

  // button handlers
  $scope.startTest = function () {
    if ($scope.job.status === 'running' ||
        $scope.job.status === 'submitted') return;
    startJob($scope.job.repo_url, 'TEST_ONLY');
    $scope.job = {
      repo_url: $scope.job.repo_url,
      status: 'submitted',
      output: ''
    };
  };
  $scope.startDeploy = function () {
    if ($scope.job.status === 'running' ||
        $scope.job.status === 'submitted') return;
    startJob($scope.job.repo_url, 'TEST_AND_DEPLOY');
    $scope.job = {
      repo_url: $scope.job.repo_url,
      status: 'submitted',
      output: ''
    };
  };

  // Socket update stuff
  var console = document.querySelector('pre.console-output');

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
  io.connect().on('new', function (data) {
    if (data.repo_url != repo.url) return;
    data.past_duration = $scope.jobs.list[0].duration;
    data.duration = 0;
    data.output = '';
    $scope.job = jobs.update(project, data);
    startJobTimer(data.id);
    jobid = data.id;
    $location.path('/' + project + '/job/' + jobid);
    $scope.$root.$digest();
  }).on('update', function (data) {
    if (data.repo_url != repo.url) return;
    if (!$scope.jobs.ids[data.id]) {
      var d = new Date().getTime();
      $scope.job = jobs.update(project, {
        id: data.id,
        repo_url: $scope.job.repo_url,
        created_timestamp: new Date(d - data.time_elapsed*1000),
        status: 'running',
        output: '',
        past_duration: 30,
        duration: parseInt(data.time_elapsed)
      });
      if ($scope.jobs.list[1]) {
        $scope.job.past_duration = $scope.jobs.list[1].duration;
      }
    }
    startJobTimer(data.id);
    // $scope.jobs.ids[data.id].duration = parseInt(data.time_elapsed);
    var job = $scope.jobs.ids[data.id];
    if (!job.past_duration && $scope.jobs.list[0]) {
      job.past_duration = $scope.jobs.list[0].duration;
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
    $scope.job = jobs.update(project, data);
    $scope.$digest();
    // window.location = window.location;
  });
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
