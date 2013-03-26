// Use Backbone.js to render the project_config dashboard.

$(function() {
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
      $("#output").html("");
      $("#output").show();

    });
    window.socket.on('update', function(data) {
      $("#output").append(data.msg);
      $("#output").scrollTo('max');
    });
    window.socket.on('done', function(data) {
      // Refresh the jobs dashboard
      if (data.test_exitcode !== 0) {
        status_msg("Job finished. Tests failed. See logs for details", "error");
      } else if (data.job_type === "TEST_AND_DEPLOY" && data.test_exitcode === 0 && data.deploy_exitcode !== 0) {
        status_msg("Job finished. Tests passed, deploy failed", "error");
      } else if (data.job_type === "TEST_AND_DEPLOY" && data.test_exitcode === 0 && data.deploy_exitcode === 0) {
        status_msg("Job finished. Tests passed, deploy succeeded.", "success");
      } else if (data.job_type === "TEST_ONLY" && data.test_exitcode === 0) {
        status_msg("Job finished. Tests passed", "success");

      }
      $("#output").append(data.msg);
      $("#output").scrollTo('max');
    });
  }

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

      },
      type: "POST"
    });
  };

  // One repository from /api/github/metadata
  window.Repo = Backbone.Model.extend({
    short_url: function() {
      return this.get('html_url').replace(/https:\/\/github.com/gi, '');
    },

    defaults: function() {
      return {
        enabled: false
      };
    }
  });

  // All repositories from /api/github/metadata
  window.RepoListCollection = Backbone.Collection.extend({
    model: Repo,
    url: "/api/github/metadata",
    parse: function(response) {
      return response.repos;
    }
  });

  window.RepoList = new RepoListCollection();

  // Represents an individual Repo in the list
  window.RepoView = Backbone.View.extend({
    template: _.template($("#project-config-item").html()),

    events: {
      // We will have some here eventually.
    },

    initialize: function() {
      this.model.bind("change", this.render, this);
      this.model.bind("destroy", this.remove, this);
    },

    render: function() {

      var data = this.model.toJSON();
      data.short_url = this.model.short_url();
      $(this.el).html(this.template(data));
      $(this.el).find(".test-only-action").click($.proxy(function() {
        startJob(this.model.attributes.html_url, "TEST_ONLY");
      }, this));
      $(this.el).find(".test-and-deploy-action").click($.proxy(function() {
        startJob(this.model.attributes.html_url, "TEST_AND_DEPLOY");
      }, this));
      return this;
    }


  });



  // Represents the whole JS dashboard App
  window.DashboardAppView = Backbone.View.extend({

    el: $("#dashboard"),
    events: {
      "click .refresh-button" : "refresh"
    },
    refresh: function ( event ){
      status_msg("Refreshing repository list...", "info", "#spinner-msg");
      $.ajax("/api/github/metadata?refresh=1", {
            success: function(data, ts, xhr) {
                RepoList.fetch();
                var repo_count = 0;
                if (data.repos) {
                  repo_count = data.repos.length;
                }
            }
          });
    },

    template: _.template($("#project-config-app").html()),

    initialize: function() {
      RepoList.bind('all', this.render, this);
      RepoList.bind('reset', this.addData, this);

      status_msg("Fetching available repository information from Github...", "info", "#spinner-msg");

      RepoList.fetch();

    },

    render: function() {
    },

    addData: function() {
      this.addRepos();
    },

    addRepos: function() {
      any_configured = RepoList.any(function(item) {
        return item.attributes.configured;
      });
      $(this.el).html(this.template({any_configured:any_configured,
        show_all:this.show_all}));
      $(this.el).find('.btn').click($.proxy(function() {
        this.show_all = true;
        this.addRepos();
      }, this));

      RepoList.each($.proxy(function(repo) {

        var view = new RepoView({model: repo});
        var repoel = view.render().el;
        $("#repo-list").append(repoel);

      }, this));
      if ($("#spinner").hasClass('alert-info')) {
        $("#spinner").hide();
      }
    }
  });

  window.DashboardApp = new DashboardAppView();

});


// == Dirty Filter Box
$(function(){
  $('#dashboard').on('keyup', '.repoFilters', function(){
    var filterText = $(this).val();
    console.log("Filter", filterText);

    $('#repo-list>div').each(function(){
      if (filterText == ''){
        $(this).show()
      } else {
        var found = $(this).find(":contains(" + filterText + ")").length
        if (found > 0){
          $(this).show()
        } else {
          $(this).hide()
        }
      }
    })

  })

})
