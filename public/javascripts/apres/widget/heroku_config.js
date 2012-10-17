define(
  ['apres', 'jquery', 'underscore'],
  function(apres, $, _) {
    var HerokuConfigWidget = function(elem, params) {
      var template_source = $("#heroku-config");
      var params = apres.controller().params;
      var template = _.template(template_source.html());
      this.events = {
        "click #save-deploy-on-green.btn-primary": function() {
          var deploy_on_green = $("#deploy-on-green").is(":checked");
          $.ajax("/api/heroku/config", {
                data: {url:params.repo_url, deploy_on_green:deploy_on_green},
                error: function(xhr, ts, e) {
                  $(".alert")
                    .removeClass().addClass("alert alert-error").html("Error toggling deploy on green.");
                },
                success: function(data, ts, xhr) {
                  $(".alert")
                    .removeClass().addClass("alert alert-success").html("'Deploy on Green' set to " + deploy_on_green);
                },
                type: "POST",
          });
        },
        "click #remove-heroku-config.btn": function() {
          $.ajax("/api/heroku/config", {
                data: {url:params.repo_url, unset_heroku:1},
                error: function(xhr, ts, e) {
                  $(".alert")
                    .removeClass().addClass("alert alert-error").html("Error removing Heroku config.");
                },
                success: function(data, ts, xhr) {
                  // Load the setup widget
                  apres.widget("#heroku", "/javascripts/apres/widget/heroku_setup.js");
                },
                type: "POST",
          });
        }
      };
      elem.find(".content").html(template(params));
    };

    return HerokuConfigWidget;
  }
);
