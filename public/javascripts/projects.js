// Use Backbone.js to render the project_config dashboard.

$(function() {
  function status_msg(msg, alertclass, id) {
    $(id).html(msg);
    $(id).removeClass().addClass("alert alert-"+alertclass);
    $(id).show();
  }

  if (window.socket === undefined) {
    window.socket = io.connect();
    window.socket.on('start', function(data) {
      status_msg("Running job...", "info", "#spinner");
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
    status_msg("Sending start message...", "info", "#spinner");


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
      $(this.el).html(this.template(data)).addClass('project');
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
      status_msg("Refreshing repository list...", "info", "#spinner");
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

      status_msg("Fetching available repository information from Github...", "info", "#spinner");

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
  // 'containsi' case-insensitive version of 'contains'
  $.extend($.expr[':'], {
    'containsi': function(elem, i, match, array)
    {
      return (elem.textContent || elem.innerText || '').toLowerCase()
      .indexOf((match[3] || "").toLowerCase()) >= 0;
    }
  });
  $('#dashboard').on('keyup', '.repoFilters', function(){
    var filterText = $.trim($(this).val());

    if (!filterText) {
      [].slice.call(document.querySelectorAll('#repo-list .project.hide')).forEach(function (item) {
        item.classList.remove('hide');
      });
      return;
    }
    [].slice.call(document.querySelectorAll('#repo-list .project')).forEach(function (item) {
      if (item.innerText.toLowerCase().indexOf(filterText) === -1) {
        item.classList.add('hide');
      } else {
        item.classList.remove('hide');
      }
    });
    console.log("Filter", filterText);

  });

})
