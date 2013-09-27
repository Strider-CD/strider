
var PHASES = ['environment', 'prepare', 'test', 'deploy', 'cleanup'];

// Events we care about:
// - job.new (job, notyours)
// - job.done
// - browser.update
function Dashboard(socket, $scope) {
  this.sock = socket;
  this.scope = $scope;
  this.scope.jobs = {};
  this.waiting = {};
  this.listen();
  this.scope.loadingJobs = true;
  this.sock.emit('getjobs');
}

Dashboard.prototype = {
  listen: function () {
    this.sock.on('job.new', this.addJob.bind(this));
    this.sock.on('job.done', this.addJob.bind(this));
    this.sock.on('browser.update', this.update.bind(this));
    this.sock.on('joblist', this.gotJobs.bind(this));
    this.sock.on('unknownjob:response', this.gotJob.bind(this));
  },
  gotJob: function (job) {
    if (!this.waiting[job._id]) return console.warn("Got unknownjob:response but wan't waiting for it...");
    var notyours = this.waiting[job._id][0][2]
      , jobs = this.scope.jobs[notyours ? 'public' : 'yours']
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
    jobs.unshift(job)
    // TODO: this.update searches for the job again. optimize
    for (var i=0; i<this.waiting[job._id]; i++) {
      this.update.apply(this, this.waiting[i]);
    }
  },
  gotJobs: function (jobs) {
    this.scope.loadingJobs = false;
    this.scope.jobs = jobs;
    this.scope.$digest();
  },
  getJob: function (id, notyours) {
    var jobs = this.scope.jobs[notyours ? 'public' : 'yours'];
    for (var i=0; i<jobs.length; i++) {
      if (jobs[i]._id === id) return jobs[i];
    }
  },
  unknownUpdate: function (id, event, args, notyours) {
    args = [id].concat(args);
    if (this.waiting[id]) {
      return this.waiting.push([event, args, notyours]);
    }
    this.waiting[id] = [[event, args, notyours]];
    this.sock.emit('unknownjob', id);
  },
  events: {
    'job.status.started': function (job, args) {
      job.started = args[0];
      job.phase = 0;
      job.status = 'running';
    },
    'job.status.errored': 'errored',
    'job.status.canceled': 'errored',
    'job.status.phase.done': function (job, args) {
      job.phase = PHASES.indexOf(args[0].phase) + 1;
    }
  },
  update: function (event, args, notyours) {
    var id = args.shift()
      , job = this.getJob(id, notyours)
      , handler = this.events[event];
    if (!job) return this.unknownUpdate(id, event, args, notyours)
    if (!handler) return;
    if ('string' === typeof handler) {
      job.status = handler;
    } else {
      handler(job, args);
    }
    this.scope.$digest();
  },
  addJob: function (job, notyours) {
    var jobs = this.scope.jobs[notyours ? 'public' : 'yours']
      , found = -1;
    for (var i=0; i<jobs.length; i++) {
      if (jobs[i].project.name === job.project.name) {
        found = 1;
        break;
      }
    }
    if (found !== -1) {
      jobs.splice(found, 1);
    }
    job.phase = 0;
    job.phases = job.type === 'TEST_ONLY' ? 4 : 5;
    jobs.unshift(job);
    this.scope.$digest();
  }
};

/*
function startJob(url, job_type, $scope) {
  $('.tooltip').hide();

  // Default job type is TEST_AND_DEPLOY
  if (job_type === undefined) {
    job_type = "TEST_AND_DEPLOY";
  }

  var data = {url:url, type:job_type};

  $.ajax("/api/jobs/start", {
    data: data,
    dataType: "json",
    error: function(xhr, ts, e) {
      $('#spinner')
        .removeClass('alert alert-error alert-success alert-info').addClass('alert alert-error')
        .text(xhr.responseText);
    },
    success: function(data, ts, xhr) {
      return;

      gotNewJob(data.job);
    },
    type: "POST"
  });
};

function gotNewJob(newjob, $scope) {
  var job = null;
  console.log('new job', newjob);

  for (var i=0; i<$scope.jobs.length; i++) {
    if ($scope.jobs[i].repo_url === newjob.repo_url) {
      job = i;
      break;
    }
  }
  if (job === null) {
    console.log("can't find job");
  } else {
    newjob.past_duration = $scope.jobs[job].duration;
    $scope.jobs.splice(job, 1);
  }
  newjob.time_elapsed = newjob.past_duration / 20;
  $scope.jobs.push(newjob);
  $scope.$digest();
}

function monitor($scope) {
  window.socket = window.socket || io.connect();
  window.socket.on('new', function (data) {
    gotNewJob(data, $scope);
    startJobTimer(data);
  }).on('update', function (data) {
    var found = false
      , repo_at = null;
    $scope.jobs.forEach(function(job, i) {
      if (job.id === data.id) {
        found = true;
        job.time_elapsed = data.time_elapsed;
      } else if (job.repo_url === data.repo_url) { // a new job we didn't know about
        repo_at = i;
      }
    });
    if (!found) { // this is a new job we didn't know about
      data.past_duration = 60;
      if (repo_at !== null) {
        data.past_duration = $scope.jobs[repo_at].duration;
        $scope.jobs.splice(repo_at, 1);
      }
      data.status = 'running';
      data.created_timestamp = new Date(new Date().getTime() - data.time_elapsed*1000).toString();
      data.duration = null;
      data.project_name = data.repo_url.split('/').slice(-2).join('/');
      data.running = true;
      data.url = '/' + data.project_name + '/job/' + data.id;
      $scope.jobs.unshift(data);
      startJobTimer(data);
    }
    $scope.$digest();
  }).on('done', function (data) {
    var ind = null;
    for (var i=0; i<$scope.jobs.length; i++) {
      if ($scope.jobs[i].repo_url === data.repo_url) {
        ind = i;
        break;
      }
    }
    if (ind !== null) {
      $scope.jobs.splice(ind, 1);
    }
    clearJobTimer(data.id);
    data.finished_time = new Date(data.finished_timestamp);
    $scope.jobs.push(data);
    $scope.$digest();
  });
  var jobtimers = {};
  function startJobTimer(job) {
    if (jobtimers[job.id]) return;
    jobtimers[job.id] = setInterval(function () {
      job.duration = parseInt((new Date().getTime()-new Date(job.created_timestamp).getTime())/1000);
      $scope.$digest();
    }, 500);
  }
  function clearJobTimer(id) {
    if (!jobtimers[id]) return;
    clearInterval(jobtimers[id]);
    jobtimers[id] = null
  }
}
*/

angular.module('dashboard', ['moment'], function ($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
}).controller('Dashboard', ['$scope', '$element', function ($scope, $element) {
  var dash = new Dashboard(window.socket || (window.socket = io.connect()), $scope);
  $scope.startDeploy = function (job) {
    startJob(job.repo_url, 'TEST_AND_DEPLOY', $scope);
  };
  $scope.startTest = function (job) {
    startJob(job.repo_url, 'TEST_ONLY', $scope);
  };
  /*
  $.ajax('/api/jobs', {
    dataType: 'json',
    success: function (data) {
      $scope.loading = false;
      $scope.jobs = data;
      $scope.$digest();
    }
  });
  */
}]);

