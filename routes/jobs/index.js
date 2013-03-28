/*
 * routes/jobs/index.js
 */

var BASE_PATH = "../../lib/"

var  _ = require('underscore')
   , crypto = require('crypto')
   , email = require(BASE_PATH + 'email')
   , feature = require(BASE_PATH + 'feature')
   , filter = require(BASE_PATH + 'ansi')
   , gh = require(BASE_PATH + 'github')
   , humane = require(BASE_PATH + 'humane')
   , logging = require(BASE_PATH + 'logging')
   , Step = require('step')
   , Job = require(BASE_PATH + 'models').Job
   ;


/*
 * GET /org/repo/latest_build - view latest build for repo
 */

exports.latest_build = function(req, res)
{
  res.statusCode = 200;
  var org = req.params.org;
  var repo = req.params.repo;
  var repo_url = "https://github.com/" + org + "/" + repo;

  req.user.get_repo_config(repo_url, function(err, repo_config) {
    if (err || repo_config === undefined) {
      res.statusCode = 500;
      res.end("you must configure " + repo_url + " before you can use it");
      return;
    }

    Job.find()
        .sort({'finished_timestamp': -1})
        .where('finished_timestamp').ne(null)
        .where('archived_timestamp', null)
        .where('repo_url', repo_config.url)
        .where('type').in(['TEST_ONLY','TEST_AND_DEPLOY'])
        .limit(20)
        .lean(true)
        .populate("_owner")
        .exec(function(err,results)
    {
      if (err) throw err;

      _.each(results, function(job) {
        job.duration = Math.round((job.finished_timestamp - job.created_timestamp)/1000);
        job.finished_at = humane.humaneDate(job.finished_timestamp);
        job.triggered_by_commit = false;
        if (job.github_commit_info !== undefined && job.github_commit_info.id !== undefined) {
          job.triggered_by_commit = true;
          job.gravatar_url = 'https://secure.gravatar.com/avatar/' + crypto.createHash('md5').update(job.github_commit_info.author.email).digest("hex") + '.jpg?' + 'd=' + encodeURIComponent('identicon');


          if (job.github_commit_info.author.username != undefined) {
            job.committer = job.github_commit_info.author.username;
            job.committer_is_username = true;
          } else {
            job.committer = job.github_commit_info.author.name;
            job.committer_is_username = false;
          }
        }
        job.id = job._id.toString();
        job.url = "/" + org + "/" + repo + "/job/" + job.id;
      });

      if (results.length === 0) {
        return res.end('no jobs for this build');
      }
      var triggered_by_commit = false;
      if (results[0].github_commit_info !== undefined && results[0].github_commit_info.id !== undefined) {
        triggered_by_commit = true;
      }

      results[0].output = filter(results[0].stdmerged);

      res.render('latest_build.html',
        {
          admin_view: false,
          jobs: results,
          results_detail: results[0],
          triggered_by_commit: triggered_by_commit,
          org:org,
          repo:repo,
          repo_url:repo_config.url,
          has_prod_deploy_target:repo_config.has_prod_deploy_target
        });
    });
  });
};

/*
 * index.job - build the job detail page
 */

exports.job = function(req, res)
{
  res.statusCode = 200;
  var org = req.params.org;
  var repo = req.params.repo;
  var job_id = req.params.job_id;
  var repo_url = "https://github.com/" + org + "/" + repo;

  Step(
    function getRepoConfig() {
      req.user.get_repo_config(repo_url, this);
    },
    function runQueries(err, repo_config){
      if (err || !repo_config) {
        res.statusCode = 500;
        res.end("you must configure " + repo_url + " before you can use it");
        return;
      }
      this.repo_config = repo_config;
      console.log("Querying for job id: " + job_id);
      Job.findById(job_id).populate("_owner").lean(true).exec(this.parallel());

      console.log("Querying for last 20 jobs for " + repo_url);
      Job.find()
        .sort({'finished_timestamp': -1})
        .where('finished_timestamp').ne(null)
        .where('repo_url',this.repo_config.url)
        .where('archived_timestamp', null)
        .where('type').in(['TEST_ONLY','TEST_AND_DEPLOY'])
        .limit(20)
        .populate("_owner")
        .lean(true)
        .exec(this.parallel());
    },
    function processAndRender(err, results_detail, results) {
      if (err) throw err;

      _.each(results, function(job) {
        job.id = job._id.toString();
        job.duration = Math.round((job.finished_timestamp - job.created_timestamp)/1000);
        job.finished_at = humane.humaneDate(job.finished_timestamp);
        if (job.github_commit_info !== undefined && job.github_commit_info.id !== undefined) {
          job.triggered_by_commit = true;
          job.gravatar_url = 'https://secure.gravatar.com/avatar/'
            + crypto.createHash('md5').update(job.github_commit_info.author.email).digest("hex")
            + '.jpg?' + 'd=' + encodeURIComponent('identicon');
          if (job.github_commit_info.author.username != undefined) {
            job.committer = job.github_commit_info.author.username;
            job.committer_is_username = true;
          } else {
            job.committer = job.github_commit_info.author.name;
            job.committer_is_username = false;
          }
        }
        job.url = "/" + org + "/" + repo + "/job/" + job.id;
      });

      // if results_detail did not return, that means this is not a valid job id
      if (!results_detail) {
        res.render(404, 'invalid job id');
      } else {

        results_detail.duration = Math.round((results_detail.finished_timestamp - results_detail.created_timestamp)/1000);
        results_detail.finished_at = humane.humaneDate(results_detail.finished_timestamp);
        results_detail.id = results_detail._id.toString();

        var triggered_by_commit = false;
        if (results_detail.github_commit_info !== undefined && results_detail.github_commit_info.id !== undefined) {
          triggered_by_commit = true;
          results_detail.gravatar_url = 'https://secure.gravatar.com/avatar/' + crypto.createHash('md5').update(results_detail.github_commit_info.author.email).digest("hex") + '.jpg?' + 'd=' + encodeURIComponent('identicon');
          if (results_detail.github_commit_info.author.username != undefined) {
            results_detail.committer = results_detail.github_commit_info.author.username;
            results_detail.committer_is_username = true;
          } else {
            results_detail.committer = results_detail.github_commit_info.author.name;
            results_detail.committer_is_username = false;
          }
        }

        results_detail.output = filter(results_detail.stdmerged);

        res.render('job.html',
          {
            admin_view: false,
            jobs: results,
            results_detail: results_detail,
            job_id:results[0].id.substr(0,8),
            triggered_by_commit: triggered_by_commit,
            org:org,
            repo:repo,
            repo_url:this.repo_config.url,
            has_prod_deploy_target:this.repo_config.has_prod_deploy_target
          });

      }
    }
  );

};
