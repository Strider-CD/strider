/*
 * routes/api/jobs.js
 */

var BASE_PATH = '../../lib/';

var _ = require('underscore')
  , Step = require('step')
  , api = require('./index.js')
  , check = require('validator').check
  , common = require(BASE_PATH + 'common')
  , email = require(BASE_PATH + 'email')
  , gh = require(BASE_PATH + 'github')
  , heroku = require(BASE_PATH + 'heroku')
  , humane = require(BASE_PATH + 'humane')
  , jobs = require(BASE_PATH + 'jobs')
  , filter = require(BASE_PATH + 'ansi')
  , ljobs = jobs
  , Job = require(BASE_PATH + 'models').Job
  , User = require(BASE_PATH + 'models').User
  , logging = require(BASE_PATH + 'logging')
  ;

var TEST_ONLY = "TEST_ONLY";
var TEST_AND_DEPLOY = "TEST_AND_DEPLOY";

// Maps a deploy provider name to the config property on the
// user object.
var deploy_provider_property_map = {
  'heroku':'heroku',
  'dotcloud':'dotcloud_config',
};

/*
 * POST /api/jobs/start
 * Requires query param <url> which is the Github html_url of the project.
 * By default runs a TEST_ONLY job.
 *
 * Accepts optional query param <type> which can be one of:
 *  TEST_ONLY - start a TEST_ONLY job.
 *  TEST_AND_DEPLOY - start a TEST_AND_DEPLOY job.
 */
exports.jobs_start = function(req, res) {
  var url;
  res.statusCode = 200;

  url = api.require_param("url", req, res);
  if (url === undefined) {
    return;
  }

  // Default job type is TEST_AND_DEPLOY but this can be overridden
  // via the "type" query parameter.
  var job_type = req.param("type");
  var supported_types = [TEST_AND_DEPLOY, TEST_ONLY];
  var found = _.find(supported_types, function(ttype) {
    return ttype == job_type;
  });

  if (found === undefined) {
    job_type = TEST_AND_DEPLOY;
  } else {
    job_type = found;
  }

  req.user.get_repo_config(url, function(err, repo_config, access_level, origin_user_obj) {
    if (err || !repo_config) {
      res.statusCode = 400;
      return res.end(JSON.stringify({"error": "you must configure " + url + " before you can start a job for it"}));
    }
    var repo_metadata = null;
    // We don't have github metadata unless we have a linked github account.
    if (origin_user_obj.github.id) {
        repo_metadata = _.find(origin_user_obj.github_metadata[origin_user_obj.github.id].repos, function(item) {
            return repo_config.url == item.html_url.toLowerCase();
        });
    }
    var repo_ssh_url, project;
    // If we have Github metadata, use that. It is loosely coupled and can self-heal things like
    // a configured Github Repo being renamed in Github (such as happened with Klingsbo)
    // We do not have metadata in the manual setup case
    if (repo_metadata) {
      repo_ssh_url = repo_metadata.ssh_url;
    } else {
      // Manual setup case - try to synthesize a Github SSH url from the display URL.
      // This is brittle because display urls can change, and the user (currently) has
      // no way to change them (other than deleting and re-adding project).
      project = gh.parse_github_url(repo_config.display_url);
      repo_ssh_url = gh.make_ssh_url(project.org, project.repo);
    }

    if (job_type === TEST_ONLY) {
      return jobs.startJob(req.user, repo_config, deploy_config, undefined, repo_ssh_url, job_type, function (job) {
        res.end(JSON.stringify({job: job}));
      });
    }
    if (!repo_config.has_prod_deploy_target) {
      res.statusCode = 400;
      return res.end(JSON.stringify({error: "TEST_AND_DEPLOY requested but deploy target not configued "}));
    }

    var deploy_config_key = deploy_provider_property_map[repo_config.prod_deploy_target.provider];
    var deploy_config = _.find(req.user[deploy_config_key], function(item) {
      return item.account_id === repo_config.prod_deploy_target.account_id;
    });
    return jobs.startJob(req.user, repo_config, deploy_config, undefined, repo_ssh_url, job_type, function (job) {
      res.end(JSON.stringify({job: job}));
    });
  });
};

/*
 * GET /api/jobs/:id
 * Return the merged output
 */
exports.raw = function(req, res) {
  function err() {
         res.statusCode = 404;
         return res.send("Job not found");
  }

  Job.findById(req.params.id)
     .lean(true)
     .exec(function (err, job) {
       if (err || !job) {
         return err()
       }
       function gotRepo(err, r) {
         if (err || !r) {
           return err()
         }
         res.setHeader('Content-type', 'text/plain');
         res.send(job.stdmerged ? filter(job.stdmerged) : '');
       }
       if (req.user) {
         userId = req.user._id;
         req.user.get_repo_config(job.repo_url, gotRepo)
       } else {
         User.findOne({"github_config":{$elemMatch:{
           "url":job.repo_url.toLowerCase(),
           "public": true
         }}}, gotRepo
         )
       }
  });
};

function killOldJobs(job) {
  if (!job.created_timestamp) return false;
  if (job.finished_timstamp !== undefined) return true;
  if (job.test_exitcode !== undefined) return;
  // anything older than 1 hour that hasn't ended is pronounced hanged
  if (new Date().getTime() - job.created_timestamp.getTime() > 60 * 60 * 1000) {
    console.log('killing old job', job.repo_url, job._id);
    var msg = '\r\n\u001b[35m[STRIDER]\u001b[0m job timeout after 10 minutes\r\n';
    var data = {
      test_exitcode: 200,
      stderr: (job.stderr || '') + msg,
      stdmerged: (job.stdmerged || '') + msg,
      finished_timestamp: new Date()
    };
    Job.findOneAndUpdate({_id: job._id}, {$set: data})
      .exec(function (err, done) {
        if (err) {
          console.log('failed to cleanup', job._id);
        }
      });
    _.extend(job, data);
  }
}

/*
 * GET /api/jobs/:org/:repo
 * Return JSON object containing the most recent builds for the given repo
 * This function is used on the job view page.
 */
exports.repo_jobs = function(req, res) {
  var org = req.params.org;
  var repo = req.params.repo;
  var repo_url = "https://github.com/" + org + "/" + repo;
  res.setHeader('Content-type', 'application/json');
  ljobs.lookup(repo_url, function (err, repo_config) {
    Job.find()
      .sort({'finished_timestamp': -1})
      .where('repo_url', repo_url.toLowerCase())
      .where('archived_timestamp', null)
      .where('type').in(['TEST_ONLY','TEST_AND_DEPLOY'])
      .limit(20)
      .populate("_owner")
      .lean(true)
      .exec(function (err, jobs) {
        if (err) return res.send('{"error": "Failed to retrieve jobs"}');
        return res.send(JSON.stringify({
          project: org + '/' + repo,
          jobs: jobs.map(function(job) {
            killOldJobs(job);
            return ljobs.buildJobInfo(job, repo_config, false);
          })
        }));
      });
  });
};

/*
 * GET /api/jobs
 * Return JSON object containing the most recent build status for each configured repo
 * This function is used to build the main dashboard status page
 */
exports.jobs = function(req, res) {

    console.log("api.jobs");
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;

    var jobsStatus = [];
    Step(
      function() {
        req.user.get_repo_config_list(this);
      },
      // Find all repos the user has at least read-level of access to
      function buildQueries(err, repo_list) {
        if (err) throw err;
        this.repo_list = repo_list;
        var group = this.group();
          // XXX When aggregation framework is out in 2.2, we can
          // likely redo this as a single query w/o needing MapReduce.
          // Doing it with $in was incorrect.
        _.each(this.repo_list, function(configured_repo) {
          Job.find()
                .sort({'finished_timestamp': -1})
                .where('type').in(['TEST_ONLY','TEST_AND_DEPLOY'])
                /* .where('finished_timestamp').ne(null) */
                .where('archived_timestamp', null)
                .where('repo_url', configured_repo.url)
                .limit(6)
                .populate("_owner")
                .lean(true)
                .exec(group());
        });
      },
      function processAndRender (err, results) {
        if (err) throw err;
        // this whole block is repeated code with admin_jobs_status, should be moved to function or method
        var l = [];
        var repo_list = this.repo_list;
        _.each(results, function(jobl) {
          var job = jobl[0]

          if (job === null) {
            return;
          }

          // find the corrent project display name
          var repo_config = _.find(repo_list, function(config) {
            return job.repo_url === config.url;
          });
          // It is possible that a job object exists for a repo which is no longer configured.
          if (repo_config === undefined) {
            console.debug("jobs() - job object exists for repo %s but no config found in repo list: %j",
                          job.repo_url, this.repo_list);
            return;
          }

          var info = jobs.buildJobInfo(job, repo_config, undefined, jobl);
          if (!info) return;
          killOldJobs(job);
          l.push(info);
        });

        // check to see if there are repos without jobs
        _.each(this.repo_list, function(configured_repo) {
          var match = false;

          for (var i=0; i<l.length; i++) {
            if (l[i].repo_url === configured_repo.url) {
              match = true;
              break;
            }
          }

          if (!match) {
            var project_name = configured_repo.display_url.replace(/^.*com\//gi, '');
            var obj = {
              success: "N/A",
              success_text: "N/A",
              repo_url: configured_repo.url,
              project_name: project_name,
              finished_at: "N/A",
              duration: "N/A"
            }
            l.push(obj);
          }

        });
        l.sort(function(a, b) {
          if (!a.finished_timestamp || !a.finished_timestamp.getTime) return true;
          if (!b.finished_timestamp || !b.finished_timestamp.getTime) return false;
          return a.finished_timestamp.getTime() < b.finished_timestamp.getTime();
        });
        // look at l
        var output = JSON.stringify(l, null, '\t');
        res.end(output);
      }
  );
}
