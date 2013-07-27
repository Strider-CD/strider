
// instead of "about %d hours"
$.timeago.settings.strings.hour = 'an hour';
$.timeago.settings.strings.hours = '%d hours';
$.timeago.settings.localeTitle = true;

/*
var JobMonitor = function () {
  window.socket = this.socket = window.socket || io.connect();
  this.attach(this.socket);
};

JobMonitor.prototype = {
  attach: function (sock) {
    sock.on('start', function (data) {
    });
  }
};
*/

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

angular.module('dashboard', [], function ($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
}).directive("toggle", function($compile) {
  return {
    restrict: "A",
    link: function(scope, element, attrs) {
      if (attrs.toggle !== 'tooltip') return;
      setTimeout(function() {
        $(element).tooltip();
      }, 0);
    }
  };
}).directive("time", function($compile) {
  return {
    restrict: "E",
    link: function(scope, element, attrs) {
      var date = new Date(attrs.datetime);
      $(element).tooltip({title: date.toLocaleString()});
      // $(element).text($.timeago(date));
      // setInterval(function () {
        // $(element).text($.timeago(date));
      // }, 60000);
      setTimeout(function () {
        $(element).timeago();
      }, 0);
    }
  };
}).controller('Dashboard', ['$scope', '$element', function ($scope, $element) {
  $scope.jobs = [];
  $scope.loading = true;
  monitor($scope);
  $scope.startDeploy = function (job) {
    startJob(job.repo_url, 'TEST_AND_DEPLOY', $scope);
  };
  $scope.startTest = function (job) {
    startJob(job.repo_url, 'TEST_ONLY', $scope);
  };
  $.ajax('/api/jobs', {
    dataType: 'json',
    success: function (data) {
      $scope.loading = false;
      $scope.jobs = data;
      for (var i=0;i<data.length; i++) {
        if (!data[i].running) {
          data[i].finished_time = new Date(data[i].finished_timestamp);
        }
      }
      $scope.$digest();
      // $('time.timeago').timeago();
      // $('[data-toggle="tooltip"]').tooltip();
    }
  });
}]);

