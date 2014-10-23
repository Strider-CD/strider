/*
 * routes/api/admin/index.js
 */

var BASE_PATH = '../../../';
var User = require(BASE_PATH + 'models').User

/*
 * GET /admin/users 
 */ 
exports.get_user_list = function(req,res) {
  var users = [];

  User.find({}).sort({'email': 1}).exec(function(err,results){
    results.forEach(function(user) {
      users.push({ id: user.id, email: user.email });
    });

    var output = JSON.stringify(users, null, '\t');
    res.end(output);
  });
}

/*
 * GET /api/admin/jobs_status
 * Returns JSON object of last 100 jobs across entire system
 */
exports.admin_jobs_status = function(req, res) {
  res.send(500, 'Not yet implemented')
}
/*

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;


 // Admin view shows the last 100 jobs across the system

  Step(
    // Find all repos the user has at least read-level of access to
    function getRepoList() {
      req.user.get_repo_config_list(this);
    },
    function runQueries(err, repo_list){
      this.repo_list = repo_list;
      console.debug("Querying for last 100 jobs across the system");
      if (req.param("limit_by_user")) {
        Job.find()
          .sort({'finished': -1})
          .where("user_id",req.param("limit_by_user"))
          .populate("user_id")
          .limit(100)
          .exec(this);
      } else {
        Job.find()
          .sort({'finished': -1})
          .populate("user_id")
          .limit(100)
          .exec(this);
      }
    },

    function processAndRender(err, results) {
      if (err) throw err;

      var l = [];
      var repo_list = this.repo_list;
      _.each(results, function(job) {

        var duration = job.duration
        var finished_at = humane.humaneDate(job.finished_timestamp);

        // if it is an orphan job - user doesn't exist anymore - then skip
        if (job._owner == undefined) {
          console.log("job without owner: " + job.id);
          return;
        }

        var project_name= job.repo_url.replace(/^.*com\//gi, '');

        var job_url = "/admin/" + project_name + "/job/" + job.id;

        var triggered_by_commit = false;
        if (job.github_commit_info.id !== undefined) {
          triggered_by_commit = true;
        }

        var committer;
        var committer_is_username=false;
        if (job.github_commit_info.author.username != undefined) {
          committer = job.github_commit_info.author.username;
          committer_is_username = true;
        } else {
          committer = job.github_commit_info.author.name;
        }
        owner_gravatar_url = 'https://secure.gravatar.com/avatar/' + crypto.createHash('md5').update(job._owner.email).digest("hex") + '.jpg?' + 'd=' + encodeURIComponent('identicon') + "&s=40";
        var obj = {
          owner: job._owner.email,
          owner_gravatar_url:owner_gravatar_url,
          duration: duration,
          finished_at: finished_at,
          triggered_by_commit: triggered_by_commit,
          committer: committer, 
          committer_is_username: committer_is_username,
          commit_id: job.github_commit_info.id,
          repo_url: job.repo_url,
          project_name: project_name,
          job_url: job_url,
          job_id: job.id,
          type: job.type,
          created_timestamp: job.created_timestamp,
          finished_timestamp: job.finished_timestamp,
        }
        l.push(obj);
      });

      var output = JSON.stringify(l, null, '\t');
      res.end(output);
    }
  );


};
 */
