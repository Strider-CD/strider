/*
 * routes/admin/index.js
 */

var BASE_PATH = "../../lib/";

var  _ = require('underscore')
  , crypto = require('crypto')
  , Step = require('step')
  , feature = require(BASE_PATH + 'feature')
  , gh = require(BASE_PATH + 'github')
  , humane = require(BASE_PATH + 'humane')
  , logging = require(BASE_PATH + 'logging')
  , nibbler = require(BASE_PATH + 'nibbler')
  , email = require(BASE_PATH + 'email')
  , InviteCode = require(BASE_PATH + 'models').InviteCode
  , Job = require(BASE_PATH + 'models').Job
  , User = require(BASE_PATH + 'models').User
  ;



/*
 * make_invite_code()
 *
 * Generate a sweet BASE32 invite code
 */
function make_invite_code() {
  var random = crypto.randomBytes(5).toString('hex');

  return nibbler.b32encode(random);
}

/*
 * GET /admin/invites - admin interface for invites
 */
exports.invites = function(req, res)
{
  InviteCode.find({}).populate('consumed_by_user').sort({'_id': -1}).exec(function(err, results) {
    _.each(results, function(invite) {
      invite.created = humane.humaneDate(invite.created_timestamp);
      invite.consumed = humane.humaneDate(invite.consumed_timestamp);      
    });

    res.render('admin/invites', {invite_code: make_invite_code(), invite_codes:results});
  });
};

/*
 * GET /admin/users - admin interface for users
 */

exports.users = function(req,res)
{
  var users=[];
  console.log("user: %s", User);
  User.find({}).sort({'_id': -1}).exec(function(err,results){
    _.each(results, function(user) {

      timestamp = user.id.toString().substring(0,8);
      user.created_date = humane.humaneDate(new Date( parseInt( timestamp, 16 ) * 1000 ));

      users.push(user);
    });

   res.render('admin/users',{users:users});
 }); 
}

exports.make_admin = function(req,res) {

  console.log(req.query.user);
  if (req.query.user != undefined) {
    var conditions = { email: req.query.user }
      , update = {  account_level: 1 }
      , options = {};

    User.update(conditions, update, options, function(err,numAffected) {
      if (err) throw err;
      if (numAffected == 1) {
        console.log("Admin status granted to: " + req.query.user);

        // if in production, notify core about new admin
        if (process.env.NODE_ENV !== undefined
          && process.env.NODE_ENV === "production") {
            email.notify_new_admin(req.query.user);
          }
      }
      res.redirect('/admin/users');
    });
  } else {
    console.log("email undefined!");
    res.redirect('/admin/users');
  }
}

/*
 * GET /admin/projects - admin interface for projects
 */

exports.projects = function(req,res)
{
  var projects=[];
  User.find({})
    .sort({'github_config._id': '-1'})
    .exec(function(err,results){
    _.each(results, function(user) {
      var gh_config = user.github_config || [];
      _.each(gh_config, function(item) {
        if (item.url !== undefined) {
            var project={};
            project.user = user.email
            project.url = item.url;
            project.name= item.display_url.replace(/^.*com\//gi, '');
            timestamp = item.id.toString().substring(0,8);
            project.created_date = new Date( parseInt( timestamp, 16 ) * 1000 );            
            projects.push(project);
        }
      });
    });

   res.render('admin/projects',{projects:projects});
 }); 
}

/*
 * index.admin_job - build the admin job detail page
 * this is very similar although slightly different from the job function above. 
 * at some point they should be refactored to combine redundant func.
 */

exports.job = function(req, res)
{
  res.statusCode = 200;
  var org = req.params.org;
  var repo = req.params.repo;
  var job_id = req.params.job_id;
  var repo_url = "https://github.com/" + org + "/" + repo;

  var repo_url = repo_url.toLowerCase();

  Step(
    function runQueries(){
      console.log("Querying for job id: " + job_id);
      Job.findById(job_id).populate("_owner").exec(this.parallel());

      console.log("Querying for last 20 jobs for " + repo_url);
      Job.find()
        .sort({'finished_timestamp': -1})
        .where('finished_timestamp').ne(null)
        .where('repo_url',repo_url)
        .where('type').in(['TEST_ONLY','TEST_AND_DEPLOY'])
        .limit(20)
        .populate("_owner")
        .exec(this.parallel());
    },
    function processAndRender(err, results_detail, results) {
      if (err) throw err;

      _.each(results, function(job) {
        job.duration = Math.round((job.finished_timestamp - job.created_timestamp)/1000);
        job.finished_at = humane.humaneDate(job.finished_timestamp);
        if (job.github_commit_info.id !== undefined) {
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
        job.url = "/admin/" + org + "/" + repo + "/job/" + job.id;
      });

      // if results_detail did not return, that means this is not a valid job id
      if (results_detail === undefined) {
        res.render(404, 'invalid job id');
      } else {

        results_detail.duration = Math.round((results_detail.finished_timestamp - results_detail.created_timestamp)/1000);
        results_detail.finished_at = humane.humaneDate(results_detail.finished_timestamp);

        var triggered_by_commit = false;
        if (results_detail.github_commit_info.id !== undefined) {
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
        
        results_detail.output = results_detail.stdmerged.replace(/\[(\d;)?\d*m/gi,'');
        
        
        var has_prod_deploy_target = false;
        var admin_view = true;

        res.render('job',
          {
            admin_view: admin_view,
            jobs: results,
            results_detail: results_detail,
            triggered_by_commit: triggered_by_commit,
            org:org,
            repo:repo,
            repo_url:repo_url,
            has_prod_deploy_target:has_prod_deploy_target
          });
        
      }
    }
  );

};

