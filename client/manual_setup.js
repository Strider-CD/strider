function init_manual_setup() {
    var model;
    var EnterGithubURLView;
    var ConfigurationInstructionsView;
    var SetupCompleteView;

    var spinner = $("#spinner");    
  
    var webhook;
    var deploy_key_title;
    var deploy_public_key;
    var github_url;
    var org;
    var project;

    Backbone.View.prototype.close = function(){
      this.remove();
      this.unbind();
      if (this.onClose){
        this.onClose();
      }
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


    window.ManualSetupRouter = Backbone.Router.extend( {
      routes: {
        "start": "enter_github_url",
        "configuration_instructions": "configuration_instructions",
        "setup_complete": "setup_complete"
      },

      enter_github_url: function() {
        window.SetupApp.model.set('state', 'enter_github_url');
      },
      configuration_instructions: function() {
        window.SetupApp.model.set('state', 'configuration_instructions');
      },
      setup_complete: function() {
        window.SetupApp.model.set('state', 'setup_complete');
      }
    });

    window.GithubModel = Backbone.Model.extend({
      name: function() {
        return this.get('repo').display_url.replace(/^.*com\//gi, '');
      }
    });


    window.EnterGithubURL = Backbone.View.extend({
      template: _.template($("#enter_github_url").html()),

      current_view: EnterGithubURLView,

      events : {
        'click .continue':function(ev) {
      
          github_url = $(this.el).find('input[name="github_url"]').val();

          console.log("starting manual setup for: " + github_url);
          
          var ghRegexp1 = /(?:https*:\/\/)*github.com\/(\S+)\/(\S+)\/?/;;
          var match1 = ghRegexp1.exec(github_url);
          
          var control_group = $(this.el).find('div.control-group');
          var help_inline = $(this.el).find('span.help-inline');
          
          if (match1 == null) {
            control_group.addClass('error');
            help_inline.html('Not a valid Github URL');
          } else {
                    
            $.ajax("/api/github/manual_setup", {
               data: { github_url:  github_url },
               dataType: "json",
               error: function(xhr, ts, e) {
                 console.log(xhr.responseText);
                 var data = $.parseJSON(xhr.responseText);
                 console.log(data);
                 if (data.errors === "Repo Already Configured") {
                   // remove github URL error if present
                   control_group.removeClass('error');
                   help_inline.html('');
                   
                   // add alert 
                   spinner.html(github_url + ' has already been configured for use with Strider.').removeClass().addClass("alert alert-error");
                   spinner.show();
                 } else if (data.errors === "Not a valid Github URL") {
                   spinner.html(github_url + ' is not a valid github url.').removeClass().addClass("alert alert-error");
                   spinner.show();
                 } else {
                   spinner.html('Unknown Error').removeClass().addClass("alert alert-error");
                   spinner.show();
                 }

               },
               success: $.proxy(function(data, ts, xhr) {
                 //spinner.html('Github URL Valid').removeClass().addClass("alert alert-success");
                 webhook = data.webhook;
                 deploy_key_title = data.deploy_key_title;
                 deploy_public_key = data.deploy_public_key;
                 project = data.repo;
                 org = data.org;
                 github_url = "https://github.com/" + data.org + "/" + data.repo;
               
                 var spinner_msg = org + "/" + project + " has been added to Strider."
                 spinner.html(spinner_msg).removeClass().addClass("alert alert-success");
                 spinner.show();
                 
                 window.app_router.navigate("configuration_instructions", {trigger: true});
               }, this),
               type: "POST"
             });
           }
        },

      },
      render: function() {
        $(this.el).html(this.template(this.model.toJSON()));

        return this;
      },

      initialize: function() {
        this.model.bind('destroy', this.remove, this);
      }

    });

    window.ConfigurationInstructions = Backbone.View.extend({
      template: _.template($("#configuration_instructions").html()),

      current_view: ConfigurationInstructionsView,

      events: {
        'click .continue' : function(ev) {
          
          $.ajax("/api/jobs/start", {
            data: {url: github_url.toLowerCase(), type:"TEST_ONLY"},
            dataType: "text",
            type: "POST",
            error: function(xhr, ts, e) {
              console.log("job start failure: " + xhr.responseText);
            },
            success: function(data, ts, xhr) {

              console.log("success with job start "); 
              // route to setup complete page
              // ideally we would test the webhook and deploy key too

              window.location.href="/";
            }
          });

          
          

        }

      },

      render: function() {
        $(this.el).html(this.template({webhook: webhook,deploy_key_title:deploy_key_title,deploy_public_key:deploy_public_key,github_url:github_url,org:org,project:project}));
        return this;
      },
    });

    window.SetupModel = Backbone.Model.extend();

    window.SetupAppView = Backbone.View.extend({
      el: "#manual-setup-app",

      render: function() {
        var model;
        var el;
        switch (this.model.get('state')) {
          case 'enter_github_url':
            this.current_view.close()
            this.current_view = EnterGithubURLView;
            el = this.current_view.render().el;
            $(this.el).html(el);
            break;

          case 'configuration_instructions':
            this.current_view.close()
            this.current_view = ConfigurationInstructionsView;
            el = this.current_view.render().el;
            $(this.el).html(el);
            $('.clippy').clippy({clippy_path:"/javascripts/clippy.swf"});
            break;

          case 'setup_complete':
          this.current_view.close()
          this.current_view = SetupCompleteView;
            $(this.el).html(_.template($("#setup_complete").html()));
            break;
        }
        if (this.current_view !== undefined) {
            this.current_view.delegateEvents();
        }
      },

      initialize: function() {
        this.model.bind('change', this.render, this);
        this.model.bind('destroy', this.remove, this);
        this.current_view = EnterGithubURLView;
      }
    });

    // this window is no longer in use so should be removed
    window.SetupComplete = Backbone.View.extend({
      template: _.template($("#setup_complete").html()),
      current_view: SetupCompleteView,

      events: {
        'click .continue' : function(ev) {
          
          console.log("click test event");
          $.ajax("/api/jobs/start", {
            data: {url: github_url.toLowerCase(), type:"TEST_ONLY"},
            dataType: "text",
            type: "POST",
            error: function(xhr, ts, e) {
              console.log("job start failure: " + xhr.responseText);
            },
            success: function(data, ts, xhr) {

              console.log("success with test run start"); 
              // route to setup complete page
              // ideally we would test the webhook and deploy key too

              window.location.href="/";

            }
          });
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
    
    model = new GithubModel();
    EnterGithubURLView = new EnterGithubURL({model: model});
    ConfigurationInstructionsView = new ConfigurationInstructions({model: model});
    SetupCompleteView = new SetupComplete({model: model});


}
