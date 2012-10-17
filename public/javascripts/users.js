
$(function(){


  var User = Backbone.Model.extend({

    initialize: function() {
      //nothing here yet      
    }
  });

  // The collection of Users is backed by api.js pulling from mongodb
  var UserList = Backbone.Collection.extend({

    // Reference to this collection's model.

      model: User,
      url: "/api/admin/users",
      parse: function(response) {
        return response;
      }
    });



  // Create our global collection of **Users**.
  var Users = new UserList();

  // User Item View
  // --------------

  // The DOM element for a User item...
  var UserView = Backbone.View.extend({

    //... is a class. not sure how to put that here
    tagName:  "option",

    // Cache the template function for a single item.
    template: _.template($('#user-item-template').html()),

    // The DOM events specific to an item.
    // maybe could put links here? but then user couldn't see on mouse-over

    // The UserView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **User** and a **UserView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      _.bindAll(this, 'render');
      this.model.bind('change', this.render);
      this.model.bind('destroy', this.remove);
    },

    // Re-render the contents of the User item.
    render: function() {
      $(this.el).html(this.template(this.model.toJSON()));
      return this;
    },

    // Remove the item, destroy the model.
    clear: function() {
      this.model.clear();
    }

  });

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  var UsersView = Backbone.View.extend({
    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#user-form"),

    // no events here either at this time

    // At initialization we kick things off by
    // loading list of Users from the db
    initialize: function() {
      _.bindAll(this, 'addAll', 'addOne','render');

      Users.bind('add',     this.addOne);
      Users.bind('reset',   this.addAll);
      Users.bind('all',     this.render);

      console.log("fetching Users");
      Users.fetch();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      console.log("rendering User AppView");
      // might want to put some total stats for the Users somewhere on the page

    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(User) {
      console.log("adding one User: " + User.get("id") + "/" + User.get("email"));
      var view = new UserView({model: User});
      this.$("#user-list").append(view.render().el);
    },

    // Add all items in the **Users** collection at once.
    addAll: function() {
      console.log("adding all Users");
      console.log(Users.length + " Users");
      Users.each(this.addOne);
    }


  });
  // Finally, we kick things off by creating the **App**.
  console.log("starting userapp now");
  var UsersApp = new UsersView();

});
