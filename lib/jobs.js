var common = require('./common')
var config = require('./config')
var logging = require('./logging')
var Job = require('./models').Job
var Step = require('step')

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
      common.emitter.emit('queue.new_job', {
        user_id: user._id.toString(),
        job_id: job._id.toString(),
        repo_config: rc,
        deploy_config: dc,
        deploy_target: deploy_target,
        repo_ssh_url: repo_ssh_url,
        job_type: job_type,
        github_commit_info: github_commit_info,
      })
      job.project_deployable = repo_config.has_prod_deploy_target;
      if (next) next(job);
    }
  )
}

module.exports = {
  startJob:startJob,
}
