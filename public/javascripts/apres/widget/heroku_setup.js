define(
    ['apres', 'jquery', 'bootstrap'],
    function(apres, $, bootstrap) {

      var HerokuSetupWidget = function(elem, params) {
        var repo_url = apres.controller().params.repo_url;
        var prompt_template = _.template($("#heroku-key-prompt").html());
        var select_template = _.template($("#heroku-app-prompt").html());
        var self = this;

        function message(message, classes) {
          elem.find("div.alert").removeClass().addClass("alert " + classes).html(message).show();
        }

        function message_hide() {
          elem.find("div.alert").hide();
        }

        this.events = {
          'click .heroku-prompt.btn-primary':function(ev) {
            var btn = $(ev.target);
            btn.attr('disabled', 'disabled');
            message("Connecting to Heroku...", "alert-info");

            var api_key = elem.find('#api-key').val();
            var self = this;
            $.ajax("/api/heroku/account_integration", {
              data: {api_key:api_key},
              dataType: "json",
              error: function(xhr, ts, e) {
                message("Heroku API key invalid", "alert-error");
                btn.removeAttr('disabled');
              },
              success: function(data, ts, xhr) {
                message("Heroku connected", "alert-success");
                self.api_key = data.api_key;
                self.heroku_apps = data.heroku_apps;
                self.account_id = data.account_id;
                // Show app selector here
                elem.find('.content').html(select_template({heroku_apps:self.heroku_apps}));
              },
              type: "POST"
            });
          },

          'click .heroku-select.btn-primary':function(ev) {
            var btn = $(ev.target);
            elem.find(".btn").attr('disabled', 'disabled');
            message("Configuring Heroku continuous deployment...", "alert-info");

            var app_name = elem.find("#app").val();
            if (elem.find("#app").val() === "@@new@@") {
              app_name = elem.find("#new-app-name").val();
            }
            var self = this;
            $.ajax("/api/heroku/delivery_integration", {
              data: {
                 account_id:self.account_id
               , gh_repo_url:repo_url
               , app_name:app_name
              },
              dataType: "json",
              error: function(xhr, ts, e) {
                var data = $.parseJSON(xhr.responseText);
                message('Error: ' + data.errors[0], "alert-error");
                btn.removeAttr('disabled');
              },
              success: function(data, ts, xhr) {
                message("Heroku continuous deployment integration complete.", "alert-success");
                // Update controller with new settings
                apres.controller().params.deploy_on_green = true;
                apres.controller().params.has_prod_deploy_target = true;
                apres.controller().params.deploy_target_name = app_name;

                // Load the setup widget
                apres.widget("#heroku", "/javascripts/apres/widget/heroku_config.js");
              },
              type: "POST",
            });

          },

          'click .btn-back':function(ev) {
            elem.find('.content').html(prompt_template());
          },

          'change select':function(ev) {
            if (elem.find("#app").val() === "@@new@@") {
              elem.find(".appname").show();
            } else {
              elem.find(".appname").hide();
            }
          },
        },

        elem.find('.content').html(prompt_template());
      };

      return HerokuSetupWidget;

    }
);
