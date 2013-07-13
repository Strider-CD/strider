// Use Backbone.js to render the dashboard.

$(function() {

  var intervals = {}
  // instead of "about %d hours"
  $.timeago.settings.strings.hours = '%d hours';
  $.timeago.settings.localeTitle = true;

  function addInterval(url, i) {
    if (intervals[url] && intervals[url].indexOf(i) === -1) {
      intervals[url].push(i);
      return;
    }
    intervals[url] = [i];
  }

  function rmIntervals(url) {
    if (intervals[url]) {
      for (var i=0; i < intervals[url].length; i++) {
        var interval = intervals[url][i];
        clearInterval(interval);
      }
      delete intervals[url];
    }

  }

  function status_msg(msg, alertclass, templateselector) {
    var el;
    if (templateselector === undefined) {
      el = $("#job-output");
    } else {
      el = $(templateselector);

    }
    $("#spinner").html(_.template(el.html(), {message:msg}));
    $("#spinner").removeClass().addClass("alert alert-"+alertclass);
    $("#spinner").show();
  }

  if (window.socket === undefined) {
    window.socket = io.connect();
    window.socket.on('start', function(data) {
      status_msg("Running job...", "info", "#spinner-msg");

    });
    window.socket.on('update', function(data) {
      var job = JobList.find(function(item) {
        return item.get('repo_url') === data.repo_url;
      });

      var previous_duration = 600;
      if (job !== undefined || job.get('duration') === "N/A") {
       var previous_duration = job.get('duration');   
      }
      
      var current_duration = Math.round(data.time_elapsed);
      var percent_completion = (current_duration / previous_duration) * 100;
      // Don't let this overflow, just for sanity's sake
      if (percent_completion > 100) {
        percent_completion = 100;
      }
      // This handles the case that we missed a start event
      if (job.get('in_progress') !== true) {
        startProgressMeter(job, percent_completion, current_duration);
      }

      
    });
    window.socket.on('done', function(data) {
      var job = JobList.find(function(item) {
        return item.get('repo_url') === data.repo_url;
      });
      if (job !== undefined) {
        rmIntervals(job.get('repo_url'));
      }
      // Refresh the jobs dashboard
      JobList.fetch();
      if (data.test_exitcode !== 0) {
        status_msg("Job finished. Tests failed. See logs for details", "error");
      } else if (data.job_type === "TEST_AND_DEPLOY" && data.test_exitcode === 0 && data.deploy_exitcode !== 0) {
        status_msg("Job finished. Tests passed, deploy failed", "error");
      } else if (data.job_type === "TEST_AND_DEPLOY" && data.test_exitcode === 0 && data.deploy_exitcode === 0) {
        status_msg("Job finished. Tests passed, deploy succeeded.", "success");
      } else if (data.job_type === "TEST_ONLY" && data.test_exitcode === 0) {
        status_msg("Job finished. Tests passed", "success");

      }
    });
  }

  window.startProgressMeter = function(job, percent_completion, time_elapsed) {
    console.log("start");
    var previous_duration = job.get('duration');
    if (previous_duration === "N/A") {
      previous_duration = 600;
    }
    
    job.set('duration_text', "TBD");
    job.set('finished_at',"<i>In Progress</i>");
    job.set('success',"TBD");
    job.set('success_text',"TBD");
    job.set("created_timestamp",new Date());
    
    var start_time = new Date().getTime() / 1000;
    job.set('in_progress', true);
    if (percent_completion === undefined) {
      job.set('progress', 0);
    } else {
      job.set('progress', percent_completion);
    }
    if (time_elapsed !== undefined) {
      start_time = start_time - time_elapsed;
    }
    console.log("setInterval");
    var bar_interval = setInterval(function() {
      addInterval(job.get('repo_url'), bar_interval);
      var current_duration = (new Date().getTime() / 1000) - start_time;
      var percent_completion = (current_duration / previous_duration) * 100;
      // Don't let this overflow, just for sanity's sake
      if (percent_completion >= 100) {
        percent_completion = 100;
        rmIntervals(job.get('repo_url'));
      }
      job.set('progress', percent_completion);
    }, 1000);

  };

  window.startJob = function(url, job_type) {
    status_msg("Sending start message...", "info", "#spinner-msg");


    // Default job type is TEST_AND_DEPLOY
    if (job_type === undefined) {
      job_type = "TEST_AND_DEPLOY";
    }

    var data = {url:url, type:job_type};

    $.ajax("/api/jobs/start", {
      data: data,
      dataType: "text",
      error: function(xhr, ts, e) {
        $('#spinner')
            .removeClass('alert alert-error alert-success alert-info').addClass('alert alert-error')
            .text(xhr.responseText);
      },
      success: function(data, ts, xhr) {
        var job = JobList.find(function(item) {
          return item.get('repo_url') === url;
        });
        status_msg("Running job...", "info", "#spinner-msg");

        startProgressMeter(job);
      },
      type: "POST"
    });
  };

  // One job status of one repo

  // Represents an individual Job in the list
  window.JobView = Backbone.View.extend({
    template: _.template($("#dashboard-job-item").html()),

    events: {
      // We will have some here eventually.
    },

    initialize: function() {
      this.model.bind("change", this.render, this);
      this.model.bind("destroy", this.remove, this);
    },

    render: function() {
      if (!this.model.get('duration_text')) {
        this.model.set('duration_text', this.model.get('duration'));
      }
      $(this.el).html(this.template(this.model.toJSON()));
      $(this.el).find(".test-only-action").click($.proxy(function() {
        startJob(this.model.attributes.repo_url, "TEST_ONLY");
      }, this));
      $(this.el).find(".test-and-deploy-action").click($.proxy(function() {
        startJob(this.model.attributes.repo_url, "TEST_AND_DEPLOY");
      }, this));
      if (this.model.get('in_progress')) {
        $(this.el).find('.bar').width(this.model.get('progress') + "%");
        $(this.el).find('.progress-meter').show();
      }
      $('.timeago', this.el).timeago();
      $('[data-toggle="tooltip"]', this.el).tooltip();

      return this;
    }


  });

  // Represents the whole JS dashboard App
  window.DashboardAppView = Backbone.View.extend({

    el: $("#dashboard"),

    template: _.template($("#dashboard-app").html()),

    initialize: function() {
      //RepoList.bind('all', this.render, this);
      //RepoList.bind('reset', this.addData, this);

      //status_msg("Fetching available repository information from Github...", "info", "#spinner-msg");

      //RepoList.fetch();

      JobList.bind('all', this.render, this);
      JobList.bind('reset', this.addData, this);

      JobList.fetch();
      console.log("job list fetched");


    },
    render: function() {
      //$(this.el).html(this.template());
      //return this;
    },


    addData: function() {
      this.renderHTML();
      this.addJobs();
    },

    renderHTML: function() {
      $(this.el).html(this.template());      
    },

    addJobs: function() {
      $("#job-list .empty").remove();
      if (JobList.length > 0){
        JobList.each(function(job) {
          var view = new JobView({model: job});
          var jobel = view.render().el;
          $("#job-list").append(jobel);
        });
      } else {
        $("#job-list").append(
          _.template($("#dashboard-no-jobs").html())
        );
      }
    }
  });

  window.DashboardApp = new DashboardAppView();

});
