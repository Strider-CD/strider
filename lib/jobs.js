
var common = require('./common')
  , config = require('./config')
  , logging = require('./logging')
  , Job = require('./models').Job

  , Step = require('step')
  , crypto = require('crypto')

var TEST_ONLY = "TEST_ONLY"
var TEST_AND_DEPLOY = "TEST_AND_DEPLOY"

function startJob(user, repo_config, deploy_config, github_commit_info, repo_ssh_url, job_type, next) {
  // Create new Job object in Mongo and link to user
  var job = new Job({
    _owner: user._id,
    created_timestamp: new Date(),
    finished_timestamp: null,
    type: TEST_ONLY,
    repo_url: repo_config.url,
  })
  if (deploy_config !== undefined && repo_config.prod_deploy_target.deploy_on_green) {
    job.type = TEST_AND_DEPLOY
  }
  if (github_commit_info !== undefined) {
    job.github_commit_info = github_commit_info
  }
  Step(
    function() {
      console.debug("jobs.startJob(): saving job")
      job.save(this)
    },
    function(err, job) {
      var rc = null
      if (err) throw err
      if (repo_config) {
        rc = repo_config.toJSON()
        // XXX .get weirdness to trigger Mongoose getters
        rc.privkey = repo_config.get('privkey')
        rc.env = repo_config.get('env')
        rc.secret = repo_config.get('secret')
        rc.sauce_username = repo_config.get('sauce_username')
        rc.sauce_browsers = repo_config.get('sauce_browsers')
        rc.sauce_access_key = repo_config.get('sauce_access_key')
      }
      var deploy_target = null
      var dc = null
      if (deploy_config) {
        dc = deploy_config.toJSON()
        // XXX .get weirdness to trigger Mongoose getters
        dc.privkey = deploy_config.get('privkey')
        dc.api_key = deploy_config.get('api_key')
        console.log("deploy_config privkey: %j", dc.privkey)
        deploy_target = repo_config.prod_deploy_target
      }
      console.debug("jobs.startJob(): job saved")
      var jobinfo = {
        user_id: user._id.toString(),
        job_id: job._id.toString(),
        repo_config: rc,
        deploy_config: dc,
        deploy_target: deploy_target,
        repo_ssh_url: repo_ssh_url,
        job_type: job_type,
        github_commit_info: github_commit_info,
      };
      common.emitter.emit('queue.new_job', jobinfo, buildJobInfo(job, repo_config));
      job.project_deployable = repo_config.has_prod_deploy_target;
      if (next) next(buildJobInfo(job, repo_config));
      // if (next) next({success: true});
    }
  );
}

function buildJobInfo(job, repo_config, include_output) {
  var duration = (job.finished_timestamp ?
                  Math.round((job.finished_timestamp -
                              job.created_timestamp)/1000) : -1)
    , project_name = repo_config.display_url.replace(/^.*com\//gi, '')
    , job_url = "/" + project_name + "/job/" + job._id
    , commit = job.github_commit_info
    , triggered_by_commit = (commit !== undefined &&
                             commit.id !== undefined)
    , committer;

  if (triggered_by_commit) {
    commit.url = 'http://github.com/' + project_name + '/commit/' + commit.id;
    committer = commit.author;
    committer.url = null;
    if (committer.username !== undefined) {
      committer.name += ' @' + committer.username;
      committer.url = 'https://github.com/' + committer.username;
    }
    committer.image = gravatar(committer.email);
  }

  var info = {
    success: job.test_exitcode === 0,
    duration: duration,

    // commit stuff
    triggered_by_commit: triggered_by_commit,
    committer: committer,
    commit: job.github_commit_info,
    repo_url: job.repo_url,

    project_name: project_name,
    url: job_url,
    id: job._id,
    type: job.type,
    
    project_deployable: repo_config.has_prod_deploy_target,
    created_timestamp: job.created_timestamp,
    finished_timestamp: job.finished_timestamp,
    running: !job.finished_timestamp,
    status: job.finished_timestamp ? (job.test_exitcode === 0 ? 'succeeded' : 'failed') : 'running'
  };
  if (include_output) {
    info.output = job.stdmerged;
  }
  return info;
}

function gravatar(email) {
  return 'https://secure.gravatar.com/avatar/' + crypto.createHash('md5').update(email.toLowerCase()).digest("hex") + '?d=identicon&s=35';
}

module.exports = {
  startJob: startJob,
  buildJobInfo: buildJobInfo
}
