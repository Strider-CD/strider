/*
 * routes/jobs/index.js
 */

var BASE_PATH = "../../lib/"

var  _ = require('underscore')
   , crypto = require('crypto')
   , filter = require(BASE_PATH + 'ansi')
   , humane = require(BASE_PATH + 'humane')
   , logging = require(BASE_PATH + 'logging')
   , mongoose = require('mongoose')
   , Step = require('step')
   , Job = require(BASE_PATH + 'models').Job
   , User = require(BASE_PATH + 'models').User
   ;

function lookup(case_insensitive_url, cb) {
  User.findOne({
      "github_config.url":case_insensitive_url.toLowerCase(),
    }, function(err, user_obj) {
    if (err || !user_obj) {
      console.debug("lookup() - did not find a repo matching %s for any user",
        case_insensitive_url);
      return cb("no repo found", null);
    }
    var repo = _.find(user_obj.github_config, function(repo_config) {
      return case_insensitive_url.toLowerCase() == repo_config.url;
    });
    if (!repo) {
      console.error(
        "lookup() - Error finding matching github_config despite DB query success!");
      return cb("no repo found", null);
    }
    return cb(null, repo);
  });
};


/*
 * GET /org/repo/latest_build - view latest build for repo
 */

exports.latest_build = function(req, res)
{
  res.statusCode = 200;
  var org = req.params.org;
  var repo = req.params.repo;
  var repo_url = "https://github.com/" + org + "/" + repo;

  lookup(repo_url, function(err, repo_config) {
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

      results[0].output = results[0].stdmerged ? filter(results[0].stdmerged) : '';

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
 * index.badge - redirect to the right badge
 */
exports.badge = function(req, res) {
  res.statusCode = 200;
  var user = req.params.user;
  var org = req.params.org;
  var repo = req.params.repo;
  var repo_url = "https://github.com/" + org + "/" + repo;

  function sendBadge(name) {
    return res.redirect('/images/badges/build_' + name + '.png');
  }

  // Ignore if can't parse as ObjectID
  try {
    user = new mongoose.Types.ObjectId(user);
  } catch(e) {
    console.debug('[badge] invalid user ObjectID', user);
    return sendBadge('unknown');
  }

  Job.findOne()
    .sort({'finished_timestamp': -1})
    .where('finished_timestamp').ne(null)
    .where('archived_timestamp', null)
    // FIXME: is it always lowercase?
    .where('repo_url', repo_url.toLowerCase())
    .where('_owner', user)
    .where('type').in(['TEST_ONLY','TEST_AND_DEPLOY'])
    .exec(function(err, job) {
      if (err || !job) {
        if (err) {
          console.debug('[badge] error looking for latest build', err.message);
        }
        return sendBadge('unknown');
      }
      if (job.test_exitcode === 0) return sendBadge('passing');
      return sendBadge('failing');
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

  // Ignore if can't parse as ObjectID
  try {
    job_id = mongoose.Types.ObjectId(job_id);
  } catch(e) {
    res.statusCode = 400;
    return res.end("job_id must be a valid ObjectId");
  }

  Step(
    function getRepoConfig() {
      lookup(repo_url, this);
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
        // Some jobs never finish, to due a crash or other error condition
        if (!results_detail.finished_timestamp) {
          results_detail.finished_at = "Did not finish"
        } else {
          results_detail.finished_at = humane.humaneDate(results_detail.finished_timestamp);
        }
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

        // Jobs which have not finished have no output
        if (!results_detail.stdmerged) {
          results_detail.output = "[STRIDER] This job has no output."
        } else {
          results_detail.output = filter(results_detail.stdmerged);
        }

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
