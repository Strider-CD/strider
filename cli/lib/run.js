'use strict';

const request = require('superagent');
const debug = require('debug')('strider:cli');

function run(opts) {
  const agent = request.agent();
  const serverName = opts.server_name;
  const project = opts.project;
  const branch = opts.branch;
  const message = opts.message;
  const deploy = opts.deploy;
  let url = serverName + '/api/session';

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

        const req = request.post(url);
        const postData = { branch: branch || 'master' };

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
