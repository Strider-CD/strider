
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

angular.module('JobStatus', [], function ($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
})
  .controller('JobCtrl', ['$scope', '$element', function ($scope, $element) {
    // TODO get this via ajax.
    $scope.$watch('job.status', function (value) {
      var runtime = null;
      if (value === 'running') {
        if (runtime === null) {
          runtime = animateFav();
        }
      } else {
        if (runtime !== null) {
          clearInterval(runtime);
        }
        setFavicon(value);
      }
    });
    $scope.job = window.job;
    $scope.repo = window.repo;
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
    $('[data-toggle="tooltip"]', $element[0]).tooltip();

    // Socket update stuff
    var console = document.querySelector('pre.console-output');
    io.connect().on('start', function (data) {
      if (data.repo_url != $scope.job.repo_url) return;
      $scope.job = {
        repo_url: $scope.job.repo_url,
        status: 'running',
        output: ''
      };
      $scope.$digest();
    }).on('update', function (data) {
      if (data.repo_url != $scope.job.repo_url) return;
      if ($scope.job.status !== 'running') {
        $scope.job = {
          repo_url: $scope.job.repo_url,
          status: 'running',
          output: ''
        };
      }
      $scope.job.output += data.msg;
      var tracking = console.getBoundingClientRect().height + console.scrollTop > console.scrollHeight - 20;
      $scope.$digest();
      if (tracking) {
        console.scrollTop = console.scrollHeight;
      }
    }).on('done', function(data) {
      if (data.repo_url != $scope.job.repo_url) return;
      window.location = window.location;
    });
  }]);

function startJob(url, job_type, next) {
  var data = {url:url, type:job_type};
  setFavicon('running');

  $.ajax("/api/jobs/start", {
    data: data,
    dataType: "text",
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

/*
  $(document).ready(function() {
  if (window.socket === undefined) {
  }
  window.startJob = function(url, job_type) {
  // Default job type is TEST_AND_DEPLOY
  if (job_type === undefined) {
  job_type = "TEST_AND_DEPLOY";
  }

  var data = {url:url, type:job_type};

  $.ajax("/api/jobs/start", {
  data: data,
  dataType: "text",
  error: function(xhr, ts, e) {
  var job = JobList.find(function(item) {
  return item.get('repo_url') === url;
  });
  if (job !== undefined) {
  startProgressMeter(job);
  }
  },
  success: function(data, ts, xhr) {

  },
  type: "POST"
  });
  };

  $("a.btn.deploy").click(function() {
  startJob( '{{ repo_url}}' );
  $("a.btn.deploy").attr('disabled', 'disabled');
  $("a.btn.test").attr('disabled', 'disabled');
  status_msg("Job submitted...", "info", "#spinner-msg");
  });

  $("a.btn.test").click(function() {
  startJob( "{{repo_url}}" , "TEST_ONLY");
  $("a.btn.test").attr('disabled', 'disabled');
  $("a.btn.deploy").attr('disabled', 'disabled');
  status_msg("Job submitted...", "info", "#spinner-msg");
  });
  var offset = $('pre.console-output').prop('scrollHeight');
  $('pre.console-output').scrollTop(offset);
  });
*/
