//requires models


$(function(){

  // Create our global collection of **Jobs**.
  var Jobs = new JobList();

  // Job Item View
  // --------------

  // The DOM element for a job item...
  var JobView = Backbone.View.extend({

    //... is a class. not sure how to put that here
//    tagName:  "li",

    // Cache the template function for a single item.
    template: _.template($('#job-item-template').html()),

    // The DOM events specific to an item.
    // maybe could put links here? but then user couldn't see on mouse-over
    events: {
      "click #filter": "filter"
    },

    // The JobView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Job** and a **JobView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
      this.model.bind('destroy', this.remove);
    },

    // Re-render the contents of the job item.
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    filter: function(event) {
      console.log("triggered filter!");
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.clear();
    }

  });

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  var AppView = Backbone.View.extend({
    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#admin-jobs-status"),

    // no events here either at this time

    events: {
      "click #filter": "filterJobs" 
    },

    // At initialization we kick things off by
    // loading list of jobs from the db
    initialize: function() {
      _.bindAll(this, 'addAll', 'addOne','render');

      Jobs.bind('add',     this.addOne);
      Jobs.bind('reset',   this.addAll);
      Jobs.bind('all',     this.render);

      console.log("fetching jobs");
      Jobs.fetch();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      console.log("rendering AppView");

      // might want to put some total stats for the jobs somewhere on the page

    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(job) {
      console.log("adding one job: " + job);
      var view = new JobView({model: job});
      this.$("#job-list").append(view.render().el);
    },

    // Add all items in the **Jobs** collection at once.
    addAll: function() {
      console.log("adding all jobs");
      console.log(Jobs.length + " jobs");
      Jobs.each(this.addOne);
    },
    
    filterJobs: function() {
      var e = document.getElementById("user-list"); 

      // this is because the backbone view is actually rendering an option within an option. 
      // it's a bug that needs to be fixed but this is a hack that works to get the right index 
      var adjustedSelectedIndex = e.selectedIndex * 2 + 1;
      var user_id = e.options[adjustedSelectedIndex].value;
      this.$("#job-list").html('');
      Jobs.fetch({data:{limit_by_user:user_id}});
    }


  });
  // Finally, we kick things off by creating the **App**.
  console.log("starting now");
  var App = new AppView();

});
