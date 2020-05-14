'use strict';

module.exports = function (deps) {
  const User = deps.models().User;

  function createUser(email, password, admin, rl, force) {
    User.findByEmail(email, function (err, users) {
      if (err) {
        console.error(
          'Failed to lookup users, please let us know at https://github.com/Strider-CD/strider/issues: ',
          err
        );
        process.exit(1);
      }

      if (users.length) {
        overwrite(rl, force, function (yes) {
          if (yes) {
            User.update(
              { email: email },
              {
                password: password,
                account_level: admin,
              },
              function (err) {
                if (err) {
                  console.log('Error updating user:', err);
                  process.exit(1);
                }

                console.log('User updated successfully! Enjoy.');
                process.exit();
              }
            );
          } else {
            console.log('addUser cancelled');
            process.exit();
          }
        });
      } else {
        const u = new User();

        u.email = email;
        u.created = new Date();
        u.set('password', password);
        u.account_level = admin;

        u.save(function (err) {
          if (err) {
            console.log('Error adding user:', err);
            process.exit(1);
          }

          console.log('User created successfully! Enjoy.');
          process.exit();
        });
      }
    });
  }

  return createUser;
};

function overwrite(rl, force, cb) {
  if (force) {
    process.nextTick(function () {
      cb(force);
    });
  } else {
    rl.question('User already exists, overwrite? (y/n) [n]: ', function (
      overwrite
    ) {
      rl.close();
      cb(overwrite === 'y' || overwrite === '');
    });
  }
}
