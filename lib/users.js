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

  User.updateOne({ email: user }, { account_level: 1 }, {}, function (err, num) {
    if (err) return done(err);
    if (!num) return done();

    console.log(`Admin status granted to: ${user}`);

    // if in production, notify all other admins about new admin
    if (env === 'production') {
      getAdmins(function (err, admins) {
        admins
          .filter(function removeSelf(admin) {
            return admin.email !== user.email;
          })
          .forEach(function notifyAdmin(admin) {
            email.notifyNewAdmin(user, admin.email);
          });
      });
    }

    done(null, num);
  });
}

function getAdmins(done) {
  User.find({ account_level: 1 }, function (err, admins) {
    done(err, admins);
  });
}
