function init_kickoff() {
    var model;
    var ghView;
    var psView;
    var hksView;
    var hasView;

    var spinner = $("#spinner");

    Backbone.View.prototype.close = function(){
      this.remove();
      this.unbind();
      if (this.onClose){
        this.onClose();
      }
    }
    // Add a collaborator
    function add(url, email, access_level) {
      var data = {email: email, url: url};
      if (access_level) {
        data.access_level = access_level;
      }
      $.ajax({
        url: "/api/collaborators",
        type: "POST",
        data: data,
        dataType: "json",
        success: function(data, ts, xhr) {
          spinner.html(data.results[0].message).removeClass().addClass("alert alert-success");
          $(".collab-email").val("");
        },
        error: function(xhr, ts, e) {
          if (xhr && xhr.responseText) {
              var data = $.parseJSON(xhr.responseText);
              spinner.html("Error adding collaborator: " + data.errors[0]).removeClass().addClass("alert alert-error");
          } else {
              spinner.html("Error adding collaborator: " + e).removeClass().addClass("alert alert-error");
          }
        }
      });
    }

    function status_msg(msg, alertclass, templateselector) {
      var el;
      if (templateselector === undefined) {
        el = $("#spinner-msg");
      } else {
        el = $(templateselector);
      }
      spinner.each(function(idx) {
        $(this).html(_.template(el.html(), {message:msg}));
        $(this).show();
      });
    }
    var socket = io.connect();
    socket.on('update', function(data) {
      spinner.html(_.template($("#spinner-msg").html(),
        {message:data.msg}));
      status_msg(data.msg);
    });

    window.KickoffRouter = Backbone.Router.extend( {
      routes: {
        "start": "github",
        "paas/select": "paas_select",
        "paas/:paas/:step": "paas_step",
        "done": "done"
      },

      github: function() {
        console.log("github_select");
        window.SetupApp.model.set('state', 'github');
      },
      paas_select: function() {
        console.log("paas_select");
        window.SetupApp.model.set('state', 'paas-select');
      },
      paas_step: function(paas, step) {
        console.log("paas_step: %s step: %s", paas, step);
        window.SetupApp.model.set('state', paas + '-' + step);
      },
      done: function() {
        window.SetupApp.model.set('state', 'done');
      }
    });

    window.GithubModel = Backbone.Model.extend({
      defaults: function() {
        return {
          "private": false,
          "paas": "heroku",
          "heroku_apps": [],
          "gh_repo_url": repo.url
        };
      },
      name: function() {
        return this.get('repo').display_url.replace(/^.*com\//gi, '');
      }
    });

  function listenForRepoDone(repo_url, self) {
    socket.on('repodone', function(data) {
      socket.removeAllListeners('update');
      socket.removeAllListeners('repodone');
      status_msg("");
      spinner.html(_.template($("#spinner-msg").html(),
                              {message:"Github respository setup complete. Starting first test build."}))
        .removeClass().addClass("alert alert-info");
      $.ajax("/api/jobs/start", {
        data: {url: repo_url, type:"TEST_ONLY"},
        dataType: "text",
        type: "POST",
        error: function(xhr, ts, e) {
          console.log("job start failure: " + xhr.responseText);
        },
        success: function(data, ts, xhr) {
          spinner.html('<b>Github repository setup complete!</b> Your first test build is running. The next step is to configure Continuous Deployment.')
            .removeClass().addClass('alert alert-success');
          self.$("div.actions")
            .html('<a class="btn btn-primary run-action">Continue to deploy configuration</a> <a class="btn" href="/">Skip</a>');
          self.$(".run-action").one('click', function() {
            spinner.hide();
            window.app_router.navigate("paas/select", {trigger: true});
          });
          $(self.el).find("div.github-main-content").html(self.collab_template());
          self.$(".btn-add-collab").click(function() {
            var email = self.$(".collab-email").val();
            // Simple validation
            if (email && email.length > 0) {
              add(repo_url, email);
            } else {
              status_msg("Invalid email address", "alert-error");
            }
          });
        }
      });
    });
  }

    window.GithubSetup = Backbone.View.extend({
      template: _.template($("#github-setup").html()),
      collab_template: _.template($("#github-collaborators-template").html()),

      events : {
        'click .run-action':function(ev) {
          $(".run-action").hide();
          spinner.html(_.template($("#spinner-msg").html(),
            {message:"Starting Github repository setup..."})).removeClass().addClass("alert alert-info");
          spinner.show();

          var self = this;
          var repo_url = model.toJSON().url.toLowerCase();
          listenForRepoDone(repo_url, self);
          socket.emit("setuprepo", {repo_id:repo.id, no_ssh: true});
          /*
        },
        'click .run-public': function (ev) {
          $('.run-public, .run-action').hide();
          spinner.html(_.template($("#spinner-msg").html(),
            {message:"Starting Github repository setup..."})).removeClass().addClass("alert alert-info");
          spinner.show();

          var self = this;
          var repo_url = model.toJSON().url.toLowerCase();
          listenForRepoDone(repo_url, self);
          socket.emit("setuprepo", {repo_id:repo.id, no_ssh: true});
          */
        }
      },

      render: function() {
        $(this.el).html(this.template(this.model.toJSON()));

        return this;
      },

      initialize: function() {
        this.model.bind('destroy', this.remove, this);
      }

    });

    window.PaasSelect = Backbone.View.extend({
      template: _.template($("#paas-select").html()),

      current_view: hksView,
      paas: "heroku",

      events: {
        'click input:radio' : function(ev) {
          this.paas = ev.target.value;
          this.refresh();
        }

      },

      render: function() {
        $(this.el).html(this.template());
        this.refresh();
        return this;
      },

      refresh: function() {
        // Radio button enables Heroku / dotCloud sub-views
        if (this.current_view !== undefined) {
            this.current_view.close();
        }
        switch (this.paas) {
          case 'heroku':
            this.current_view = hksView;
          break;
        }
        this.$('input:radio[value='+this.paas+']').attr('checked', true);
        this.current_view.delegateEvents();
        var el = this.current_view.render().el;
        this.$('#subview').html(el);

        return this;

      },

    });

    window.HerokuKeySetup = Backbone.View.extend({
      template: _.template($("#heroku-key-prompt").html()),

      events: {
        'click .btn-primary':function(ev) {
          var btn = $(ev.target);
          btn.hide();
          spinner.html(_.template($("#spinner-msg").html(),
            {message:"Connecting to Heroku..."})).removeClass().addClass("alert alert-info");
          spinner.show();

          var api_key = this.$('#api-key').val();
          var self = this;
          $.ajax("/api/heroku/account_integration", {
            data: {api_key:api_key},
            dataType: "json",
            error: function(xhr, ts, e) {
              spinner.html('API key invalid.').removeClass().addClass("alert alert-error");
              btn.show();
            },
            success: function(data, ts, xhr) {
              spinner.html("Heroku connected.").removeClass().addClass("alert alert-success");
              self.model.set("api_key", api_key);
              self.model.set("heroku_apps", data.heroku_apps);
              self.model.set("account_id", data.account_id);
              window.app_router.navigate("paas/heroku/app-prompt", {trigger: true});
            },
            type: "POST"
          });
        },
       'click .btn-back' : function(ev) {
            window.history.back();
        }
      },

      render: function() {
        $(this.el).html(this.template(this.model.toJSON()));

        // this is getting triggered twice

        return this;
      },

      initialize: function() {
        this.model.bind('destroy', this.remove, this);
      },

    });

    window.HerokuAppSetup = Backbone.View.extend({
      template: _.template($("#heroku-app-prompt").html()),

      events: {
        'click .btn-primary':function(ev) {
            var btn = $(ev.target);
            btn.hide();
            spinner.html(_.template($("#spinner-msg").html(),
              {message:"Configuring Heroku continuous delivery..."}));
            spinner.show();

            var app_name = this.$("#app").val();
            if (this.$("#app").val() === "@@new@@") {
              app_name = this.$("#new-app-name").val();
            }
            console.log("gh_repo_url: %s account_id: %s", model.get('gh_repo_url'), model.get('account_id'));
            var self = this;
            $.ajax("/api/heroku/delivery_integration", {
              data: {
                 account_id:model.get('account_id')
               , gh_repo_url:model.get('gh_repo_url')
               , app_name:app_name
              },
              dataType: "json",
              error: function(xhr, ts, e) {
                var data = $.parseJSON(xhr.responseText);
                spinner.html('Error: ' + data.errors[0]).removeClass().addClass("alert alert-error");
                btn.show();
              },
              success: function(data, ts, xhr) {
                spinner.html("Heroku continuous delivery integration complete.");
                spinner.removeClass().addClass("alert alert-success");
                window.app_router.navigate("done", {trigger: true});
              },
              type: "POST",
            });
         },
        'change select':function(ev) {
          if (this.$("#app").val() === "@@new@@") {
            this.$(".appname").show();
          } else {
            this.$(".appname").hide();
          }
        },
       'click .btn-back' : function(ev) {
            window.history.back();
        }

      },

      render: function() {
        $(this.el).html(this.template(this.model.toJSON()));

        var model = this.model;

        return this;
      },

      initialize: function() {
        this.model.bind('destroy', this.remove, this);
      },

    });


    window.SetupModel = Backbone.Model.extend({
      defaults: function() {
        return {
          paas: "heroku"
        };
      }
    });

    window.SetupAppView = Backbone.View.extend({
      el: "#kickoff-app",

      render: function() {
        var model;
        var el;
        switch (this.model.get('state')) {
          case 'github':
            this.current_view.close()
            this.current_view = ghView;
            el = this.current_view.render().el;
            $(this.el).html(el);
            break;

          case 'paas-select':
            this.current_view.close()
            this.current_view = psView;
            el = this.current_view.render().el;
            $(this.el).html(el);
            break;

          case 'heroku-key-prompt':
            this.current_view.close()
            this.current_view = hksView;
            el = view.render().el;
            $(this.el).html(el);
            break;

          case 'heroku-app-prompt':
            this.current_view.close()
            this.current_view = hasView;
            el = this.current_view.render().el;
            $(this.el).html(el);
            break;
          case 'done':
            $(this.el).html(_.template($("#kickoff-done").html()));
            break;
        }
        if (this.current_view !== undefined) {
            this.current_view.delegateEvents();
        }
      },

      initialize: function() {
        this.model.bind('change', this.render, this);
        this.model.bind('destroy', this.remove, this);
        this.current_view = ghView;
      }


    });

    model = new GithubModel(repo);
    ghView = new GithubSetup({model: model});
    psView = new PaasSelect({model: model});
    hksView = new HerokuKeySetup({model: model});
    hasView = new HerokuAppSetup({model: model});

}
