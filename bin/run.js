'use strict';

var request = require('superagent');

function run() {
  var agent = request.agent();
  var serverName = require('../lib/config').server_name;
  var url = serverName + '/api/session';

  request.post(url)
    .send({
      email: email,
      password: password
    })
    .end(function (err, res) {
      if (!err && res.statusCode !== 404) {
        agent.saveCookies(res);
        url = server_name + '/' + project + '/start';

        var req = request.post(url);
        var postData = { branch: branch || 'master' };

        agent.attachCookies(req);

        if (message) {
          postData.message = message;
        }

        if (deploy) {
          postData.type = 'TEST_AND_DEPLOY';
        }

        req.send(postData);

        req.end(function (err, res) {
          if (!err && res.statusCode !== 404) {
            console.log('Job started');
          }
          else if (res.statusCode === 404) {
            console.log('Error: Repo was not found');
          }
          else {
            console.log('Error: ', err);
          }

          process.exit();
        });
      }
      else {
        console.log('Login error');
        process.exit();
      }
  });
}

module.exports = run;
