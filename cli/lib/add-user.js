'use strict';

const Step = require('step');
const readline = require('readline');
const pw = require('pw');

module.exports = function (deps) {
  const saveUser = require('./save-user')(deps);

  function addUser(email, password, admin, force) {
    let level = admin ? 1 : 0;

    if (!email || !password) {
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      Step(
        function getEmail() {
          const next = this;

          if (email) {
            next();
          } else {
            rl.question('Enter email []: ', function (em) {
              email = em;
              next();
            });
          }
        },

        function getPwd() {
          const next = this;

          if (password) {
            next();
          } else {
            rl.close();
            process.stdout.write('Enter password []: ');

            pw(function (pwd) {
              password = pwd;

              rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
              });

              next();
            });
          }
        },

        function getAdmin() {
          const next = this;

          if (level) {
            next();
          } else {
            rl.question('Is admin? (y/n) [n]', function (a) {
              level = a ? 1 : undefined;
              next();
            });
          }
        },

        function confirm() {
          const next = this;

          process.stdout.write('\nEmail:\t\t' + email + '\n');
          process.stdout.write(
            'Password:\t' + password.replace(/.*/, '****') + '\n'
          );
          process.stdout.write('isAdmin:\t' + (level ? 'y' : 'n') + '\n');

          if (force) {
            next();
          } else {
            rl.question('OK? (y/n) [y]', function (ok) {
              if (ok === 'y' || ok === '') {
                next();
              } else {
                console.log('Goodbye!');
                process.exit();
              }
            });
          }
        },

        function save() {
          saveUser(email, password, level, rl, force);
        }
      );
    } else {
      saveUser(email, password, level, rl, force);
    }
  }

  return addUser;
};
