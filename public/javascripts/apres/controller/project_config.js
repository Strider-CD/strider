/**
define(['apres', 'jquery', 'bootstrap'], function(apres, $, bootstrap) {
  var controller = {};
  var github_template;
  this.params = {};
  var paramsMap = {
    params:{type:"json", descr: "JSON string representing the repo object"},
  };
  controller.ready = function(params) {
    github_template = _.template($("#remove-github-webhooks-template").html());
    this.params = apres.getParamsFromElem($(document.documentElement), paramsMap, "data-controller-").params;
    if (this.params.has_deploy_target) {
      // Have an existing deploy target, render heroku config widget
      apres.widget($("#heroku"), "/javascripts/apres/widget/heroku_config.js");
    } else {
      // No deploy target, render heroku setup widget
      apres.widget($("#heroku"), "/javascripts/apres/widget/heroku_setup.js");
    }
  };

  controller.events = {
    'click #remove-github-webhooks': function() {

      $("#remove-github-webhooks-modal").html(github_template());
      $("#remove-github-webhooks-modal").modal();
    },
    'click #remove-github-webhooks-modal.btn': function() {
      $("#remove-github-webhooks-modal").find(".alert")
        .removeClass().addClass("alert alert-info").html("Deleting webhooks...");
      $.ajax("/api/github/webhooks/unset", {
            data: {url:params.repo_url},
            dataType: "json",
            error: function(xhr, ts, e) {
              $("#remove-github-webhooks-modal").find(".alert")
                .removeClass().addClass("alert alert-error").html("Error removing webhooks.");
            },
            success: function(data, ts, xhr) {
              $("#remove-github-webhooks-modal").find(".alert")
                .removeClass().addClass("alert alert-success").html("Webhooks removed.");
              $("#remove-github-webhooks-modal").find("div.modal-footer").html('<a class="btn btn-primary" data-dismiss="modal">Ok</a>');
            },
            type: "POST",
      });
    },
  };


  return controller;
});

**/
