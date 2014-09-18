'use strict';

var User = require('../lib/models').User;

function createUser(email, password, admin, force) {
  var u = new User();

  u.email = email;
  u.created = new Date();
  u.set('password', password);
  u.account_level = admin;

  u.save(function(err) {
    if (err) {
      console.log('Error adding user:', err);
      process.exit(1);
    }

    console.log('\nUser %s successfully! Enjoy.', force ? 'overwritten' : 'added');
    process.exit();
  });
}

module.exports = createUser;
