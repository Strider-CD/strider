/*
 * Backchannel server allows workers to stream messages back to the Node server
 * in a line-buffered way. Uses SSL.
 */

var _ = require('underscore')
 , Job = require('./models').Job
 , async = require('async')
 , common = require('./common')
 , config = require('./config')
 , crypto = require('crypto')
 , email = require('./email')
 , filter = require('./ansi')
 , fs = require('fs')
 , logging = require('./logging')
 , qs = require('querystring')
 , request = require('request')
 , websockets = require('./websockets')
;

/*
 * fire_webhooks()
 *
 * For each Webhook in the list, send a HTTP POST - in parallel.
 *
 * <repo_config> Repo Config object with the Webhooks to fire.
 * <job> Job object for the task just completed.
 */
var fire_webhooks = exports.fire_webhooks = function(repo_config, job, callback)
{

  var requests = [];

  // Add a function for each webhook
  _.each(repo_config.webhooks, function(webhook) {

    requests.push(function() {
      var body = {
        payload:JSON.stringify(
          {
            test_results: {
                start_time: job.created_timestamp
              , repo_url: repo_config.url
              , finish_time: job.finished_timestamp
              , test_exitcode: job.test_exitcode
              , deploy_exitcode: job.deploy_exitcode
              , github_commit_id: job.github_commit_info.id
            }
          })
      };
      var hmac = crypto.createHmac('sha1', webhook.secret);
      hmac.update(qs.stringify(body).toString('utf8'));
      var signature = "sha1="+hmac.digest('hex');

      console.log("Firing webhook: %s", webhook.url);
      request({
        method: "POST",
        headers:{"x-hub-signature": signature},
        form: body,
        uri: webhook.url
      }, function(e, r, b) {
        if (callback !== undefined) {
          callback(null, {e:e, b:b, r:r});
        }
      });

    });

  });

  // Run them all in parallel
  // XXX could be dangerous if there are too many
  if (requests.length > 10) {
    console.log("Warning: More %s Webhooks fired for user %s", jobs.length, user.email);
  }

  async.parallel(requests, callback);
};

/*
 * send_email()
 *
 * Send email notifications upon job completion.
 *
 * <repo_config> - Repository config object.
 * <job> - Job object.
 */
function send_email(repo_config, job)
{
  if (parseInt(job.test_exitcode, 10) === 0) {
    email.send_test_ok(job, repo_config);
  } else {
    email.send_test_fail(job, repo_config);
  }
}

/*
 * Handle individual backchannel messages
 */
function handle_message(msg)
{
  switch (msg.msg_type) {
    case 'status':
      websockets.user_msg(msg.user_id, 'update', {msg: filter(msg.stderr + msg.stdout),
        time_elapsed: msg.time_elapsed, repo_url:msg.repo_url });
      break;

    case 'done':
      Job.findOne({_id: msg.job_id}).populate('_owner').exec(function (err, job) {
        if (err) throw err;

        job.deploy_exitcode = msg.deployExitcode;
        job.test_exitcode = msg.testExitcode;
        job.finished_timestamp = new Date();
        // XXX Yeah, this isn't the best for performance, but optimize for
        // simplicity at the moment. We can incrementally stream these to S3
        // directly from Worker at some point.
        job.stderr = msg.stderr;
        job.stdout = msg.stdout;
        job.stdmerged = msg.stdmerged;
        job._owner.get_repo_config(job.repo_url, function(err, repo_config) {
          // If there is an auto-detect result, save it
          if (msg.autodetect_result !== null) {
            repo_config.project_type = msg.autodetectResult;
            job._owner.save();
          }
          if (repo_config.webhooks !== undefined) {
            fire_webhooks(repo_config, job);
          }
          // Send email if email notifications are not turned off for this repository.
          if (repo_config.email_notifications !== false) {
            send_email(repo_config, job);
          }
          websockets.user_msg(msg.user_id, 'done',
            {job_type: job.type, repo_url:msg.repo_url, test_exitcode: msg.test_exitcode, deploy_exitcode: msg.deploy_exitcode});
          job.save()
        });
      });
      break;
  }
}

exports.init = function()
{

  common.emitter.on('queue.job_update', function(msg) {
    websockets.user_msg(msg.userId, 'update', {msg: filter(msg.stderr + msg.stdout),
      time_elapsed: msg.timeElapsed, repo_url:msg.repoUrl });
  })

  common.emitter.on('queue.job_complete', function(msg) {
    websockets.user_msg(msg.userId, 'update', {msg: filter(msg.stderr + msg.stdout),
      time_elapsed: msg.timeElapsed, repo_url:msg.repoUrl });
    Job.findOne({_id: msg.jobId}).populate('_owner').exec(function (err, job) {
      if (err) throw err;

      job.deploy_exitcode = msg.deployExitCode;
      job.test_exitcode = msg.testExitCode;
      job.finished_timestamp = new Date();
      // XXX Yeah, this isn't the best for performance, but optimize for
      // simplicity at the moment. We can incrementally stream these to S3
      // directly from Worker at some point.
      job.stderr = msg.stderr;
      job.stdout = msg.stdout;
      job.stdmerged = msg.stdmerged;
      job._owner.get_repo_config(job.repo_url, function(err, repo_config) {
        // If there is an auto-detect result, save it
        if (msg.autodetectResult !== null) {
          repo_config.project_type = msg.autodetectResult;
          job._owner.save();
        }
        if (repo_config.webhooks !== undefined) {
          fire_webhooks(repo_config, job);
        }
        // Send email if email notifications are not turned off for this repository.
        if (repo_config.email_notifications !== false) {
          send_email(repo_config, job);
        }
        websockets.user_msg(msg.userId, 'done',
          {job_type: job.type, repo_url:msg.repoUrl, test_exitcode: msg.testExitCode, deploy_exitcode: msg.deployExitCode});
        job.save();
      });
    });
  })

};
