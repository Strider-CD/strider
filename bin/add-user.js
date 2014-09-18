'use strict';

var Step = require('step');
var fs = require('fs');
var readline = require('readline');
var pw = require('pw');
var saveUser = require('./save-user');
var User = require('../lib/models').User;

function addUser(email, password, admin, force) {
  var level = admin ? 1 : 0;

  if (!email || !password) {
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    Step(
      function getEmail() {
        var next = this;

        if (email) {
          next();
        } else {
          rl.question('Enter email []: ', function (em) {
            email = em;

            User.findByEmail(email, function (err, users) {
              if (users.length) {
                if (force) {
                  User.remove({ email: email }, function (error) {
                    if (error) {
                      console.error('Unable to remove existing user with email \'%s\'', email);
                      process.exit(1);
                    }

                    next();
                  });
                } else {
                  console.error('User already exists with the \'%s\' email address. Please enter a unique email address.', email);
                  email = undefined;
                  getEmail.call(next);
                }
              } else {
                next();
              }
            });
          });
        }
      },

      function getAdmin() {
        var next = this;

        if (level) {
          next();
        } else {
          rl.question('Is admin? (y/n) [n]', function (a) {
            level = a ? 1 : undefined;
            next();
          });
        }
      },

      function getPwd() {
        var next = this;

        if (password) {
          next();
        } else {
          rl.close();
          process.stdout.write('Enter password []: ');

          pw(function (pwd) {
            password = pwd;

            rl = readline.createInterface({
              input: process.stdin,
              output: process.stdout
            });

            next();
          })
        }
      },

      function confirm() {
        var next = this;

        process.stdout.write('\nEmail:\t\t' + email + '\n');
        process.stdout.write('Password:\t' + password.replace(/.*/, '****') + '\n');
        process.stdout.write('isAdmin:\t' + (level ? 'y' : 'n') + '\n');

        rl.question('OK? (y/n) [y]', function (ok) {
          if (ok === 'y' || ok === '') {
            next();
          } else {
            console.log('Goodbye!');
            process.exit();
          }
        })
      },

      function save() {
        saveUser(email, password, level, force);
      }
    );
  } else {
    saveUser(email, password, level, force);
  }
}

module.exports = addUser;
