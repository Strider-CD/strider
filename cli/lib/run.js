'use strict';

var request = require('superagent');
var debug = require('debug')('strider:cli');

function run(opts) {
  var agent = request.agent();
  var serverName = opts.server_name;
  var project = opts.project;
  var branch = opts.branch;
  var message = opts.message;
  var deploy = opts.deploy;
  var url = serverName + '/api/session';

  debug('opts: %j', opts);

  request
    .post(url)
    .send({
      email: opts.email,
      password: opts.password,
    })
    .end(function (err, res) {
      if (!err && res.statusCode !== 404) {
        agent.saveCookies(res);
        url = serverName + '/' + project + '/start';

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
          } else if (res.statusCode === 404) {
            console.log('Error: Repo was not found');
          } else {
            console.log('Error: ', err);
          }

          process.exit();
        });
      } else {
        console.error('Login error', err, res);
        process.exit(1);
      }
    });
}

module.exports = run;
