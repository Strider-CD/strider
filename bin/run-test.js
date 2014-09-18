'use strict';

var Step = require('step');
var readline = require('readline');
var run = require('./run');

function runTest(email, password, project, branch, message, deploy) {
  if(!email || !password || !project){
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    Step(
      function getEmail() {
        var next = this;

        if (email){
          next();
        }
        else {
          rl.question('Enter email []: ', function (em) {
            email = em;
            next();
          });
        }
      },

      function getPwd() {
        var next = this;

        if (password){
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

        if (project){
          next();
        } else {
          rl.question('Project name []: ', function (pr) {
            project = pr;
            next();
          });
        }
      },
      
      function runTest() {
        run();
      }
    );
  }
  else {
    run();
  }
}


module.exports = runTest;
