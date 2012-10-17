// Use Backbone.js to render the dashboard.

$(function() {

  // One repository from /api/github/metadata
  window.Repo = Backbone.Model.extend({

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

  window.RepoList = new RepoListCollection;

  // Represents an individual Repo in the list
  window.WizardStepView = Backbone.View.extend({
    tagName: "tr",

    template: _.template($("#dashboard-item").html()),

    events: {
      // We will have some here eventually.
    },

    initialize: function() {
        this.model.bind("change", this.render, this);
        this.model.bind("destroy", this.remove, this);
    },

    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },




  });

  // Represents the whole JS Wizard App
  window.WizardAppView = Backbone.View.extend({

    el: $("#wizard"),

    steps: = [
        {
          title: "Set up Github connection",
          template: "#wizard-step-1",
        },

    ],

    template: _.template($("#wizard-app").html()),

    initialize: function() {
      RepoList.bind('all', this.render, this);
      RepoList.bind('reset', this.addAll, this);
      $("#spinner").html(_.template($("#spinner-msg").html(),
        {message:"Fetching available repository information from Github..."}));
      $("#spinner").show();
      RepoList.fetch();
    },

    render: function() {

      return this;
    },

    addAll: function() {
      $(this.el).html(this.template);
      RepoList.each(function(repo) {
        var view = new RepoView({model: repo});
        var repoel = view.render().el;
        $("#repo-list").append(repoel);
      });
      $("#spinner").hide();
    },
  });

  window.WizardApp = new WizardAppView();

});
