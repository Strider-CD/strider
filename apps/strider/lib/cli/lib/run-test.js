'use strict';

const Step = require('step');
const readline = require('readline');
const run = require('./run');
const debug = require('debug')('strider:cli');

module.exports = function (deps) {
  const runOpts = {
    server_name: deps.config().server_name,
  };

  function runTest(email, password, project, branch, message, deploy) {
    if (!email || !password || !project) {
      const rl = readline.createInterface({
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
            rl.question('Enter password []: ', function (pwd) {
              password = pwd;
              next();
            });
          }
        },

        function getProject() {
          const next = this;

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
          const next = this;
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
          const next = this;
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
          const next = this;
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
