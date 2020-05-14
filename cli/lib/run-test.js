'use strict';

var Step = require('step');
var readline = require('readline');
var run = require('./run');
var debug = require('debug')('strider:cli');

module.exports = function (deps) {
  var runOpts = {
    server_name: deps.config().server_name,
  };

  function runTest(email, password, project, branch, message, deploy) {
    if (!email || !password || !project) {
      var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      Step(
        function getEmail() {
          var next = this;

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
          var next = this;

          if (password) {
            next();
          } else {
            rl.question('Enter password []: ', function (pwd) {
              password = pwd;
              next();
            });
          }
        },

        function getProject() {
          var next = this;

          if (project) {
            next();
          } else {
            rl.question('Project name []: ', function (pr) {
              project = pr;
              next();
            });
          }
        },

        function getMessage() {
          var next = this;
          if (message) {
            next();
          } else {
            rl.question('Commit message (optional): ', function (msg) {
              message = msg;
              next();
            });
          }
        },

        function getBranch() {
          var next = this;
          if (branch) {
            next();
          } else {
            rl.question('Branch (default: master): ', function (br) {
              branch = br;
              next();
            });
          }
        },

        function getDeploy() {
          var next = this;
          if (deploy) {
            next();
          } else {
            rl.question('Deploy (y/n) (default: n): ', function (a) {
              deploy = a === 'y' ? true : undefined;
              next();
            });
          }
        },

        function runTest() {
          runOpts.email = email;
          runOpts.password = password;
          runOpts.message = message;
          runOpts.project = project;
          runOpts.branch = branch;
          runOpts.deploy = deploy;
          run(runOpts);
        }
      );
    } else {
      runOpts.email = email;
      runOpts.password = password;
      runOpts.message = message;
      runOpts.project = project;
      runOpts.branch = branch;
      runOpts.deploy = deploy;
      run(runOpts);
    }
  }

  return runTest;
};
