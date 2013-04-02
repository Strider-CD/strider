$(function() {
  window.PasswordView = Backbone.View.extend({
    el: $("#change_password"),
    events: {
        "click .btn": "submit"
    },
    render: function() {
      $(this.el).html(_.template($("#change-password").html()));
      return this;
    },

    submit: function() {
      var password = $(this.el).find('input[name="password"]').val();
      var password_confirm = $(this.el).find('input[name="password_confirm"]').val();
      if (this.validate(password, password_confirm)) {
        var el = $(this.el);
        $.ajax("/api/account/password", {
          data: {password:password},
          dataType: "json",
          error: function(xhr, ts, e) {
            el.find('div.password-message')
                .removeClass('alert alert-error alert-success').addClass('alert alert-error')
                .text('Unable to change password');
          },
          success: function(data, ts, xhr) {
            el.find('div.password-message')
                .removeClass('alert alert-error alert-success').addClass('alert alert-success')
                .text('Password successfully changed');
          },
          type: "POST"}
        );
      }
    },
    validate: function(password, password_confirm) {
      $(this.el).find('div.password-message').removeClass('alert alert-error alert-success').text('');
      $(this.el).find('div.control-group').removeClass('error');
      $(this.el).find('span.help-inline').text('');
      if (password.length < 6) {
        $(this.el).find('div.control-group.password').addClass('error');
        $(this.el).find('span.help-inline.password').html('Passwords must be at least 6 characters long');
      }
      if (password != password_confirm) {
        $(this.el).find('div.control-group').addClass('error');
        $(this.el).find('span.help-inline').html('Passwords must match');
      }
      if (password == password_confirm && password.length >= 6) {
        return true;
      }
      return false;
    }
  });

  window.EmailView = Backbone.View.extend({
    el: $("#account_email"),
    events: {
        "click .btn": "submit"
    },
    render: function() {
      $(this.el).html(_.template($("#change-email").html()));
      return this;
    },

    submit: function() {
      var email = $(this.el).find('input[name="email"]').val();
      if (this.validate(email)) {
        var el = $(this.el);
        $.ajax("/api/account/email", {
          data: {email:email},
          dataType: "json",
          error: function(xhr, ts, e) {
            var resp = $.parseJSON(xhr.responseText);
            el.find('div.email-message')
                .removeClass('alert alert-error alert-success').addClass('alert alert-error')
                .text('Error: ' + resp.errors[0].message);
          },
          success: function(data, ts, xhr) {
            el.find('div.email-message')
                .removeClass('alert alert-error alert-success').addClass('alert alert-success')
                .text('Email successfully changed');
          },
          type: "POST"}
        );
      }
    },
    validate: function(email) {

      $(this.el).find('div.email-message').removeClass('alert alert-error alert-success').text('');
      $(this.el).find('div.control-group').removeClass('error');
      $(this.el).find('span.help-inline').text('');

      /* might want to validate email addresses, but on the other hand, they are hard to validate properly */

      return true;
    }
  });


  window.PasswordApp = new PasswordView()
  window.EmailApp = new EmailView();

});
