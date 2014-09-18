'use strict';

function runTest(email, password, project, branch, message, deploy) {
  var Step = require('step');
  var readline = require('readline');
  var request = require('superagent');

  var run = function() {
    var agent = request.agent()
    var server_name = require('../lib/config').server_name
    var url = server_name + "/api/session"
    request.post(url)
      .send({ email: email, password: password })
      .end(function(err, res){
        if(!err && res.statusCode !== 404){
          agent.saveCookies(res);
          url = server_name + "/"+project+"/start"
          var req = request.post(url),
          postData = {branch: branch || "master"};

          agent.attachCookies(req);

          if (message)
              postData.message = message;

          if(deploy)
              postData.type = 'TEST_AND_DEPLOY';

          req.send(postData);

          req.end(function(err, res){
            if(!err && res.statusCode !== 404){
              console.log("Job started")
            }
            else if(res.statusCode === 404){
              console.log("Error: Repo was not found")
            }
            else{
              console.log("Error: ", err);
            }
            process.exit(0);
          })

        }
        else{
          console.log("Login error")
          process.exit(0);
        }
    });
  }

  if(!email || !password || !project){
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    Step(
      function getEmail(){
          var next = this;
          if (email){
            next();
          } else {
            rl.question("Enter email []: ", function(em){
              email = em;
              next();
            });
          }
        }
      , function getPwd(){
          var next = this;
          if (password){
            next();
          } else {
            rl.question("Enter password []: ", function(pwd){
              password = pwd;
              next();
            });
          }
        }
      , function getProject(){
          var next = this;
          if (project){
            next();
          } else {
            rl.question("Project name []: ", function(pr){
              project = pr;
              next();
            });
          }
      }
      , run
      );
  }
  else{
    run();
  }
}

module.exports = runTest;
