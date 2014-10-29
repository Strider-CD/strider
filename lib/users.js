'use strict';

var User = require('./models').User;
var email = require('./email');
var env = process.env.NODE_ENV;

module.exports = {
  makeAdmin: makeAdmin
};

function makeAdmin(user, done) {
  if (typeof user !== 'string' && user.email) {
    user = user.email;
  }

  User.update({ email: user }, { account_level: 1 }, {}, function (err, num) {
    if (err) return done(err);
    if (!num) return done();

    console.log('Admin status granted to: ' + user);

    // if in production, notify core about new admin
    if (env === 'production') {
      email.notify_new_admin(user);
    }

    done(null, num);
  });
}
