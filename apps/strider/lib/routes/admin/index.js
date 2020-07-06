const base32 = require('thirty-two');
const crypto = require('crypto');
const debug = require('debug')('strider:routes:admin');
const humane = require('../../utils/humane');
const InviteCode = require('../../models').InviteCode;
const Job = require('../../models').Job;
const pjson = require('../../../package.json');
const Project = require('../../models').Project;
const projects = require('../../projects');
const Step = require('step');
const User = require('../../models').User;
const users = require('../../users');
const utils = require('../../utils');

/*
 * makeInviteCode()
 *
 * Generate a sweet BASE32 invite code
 */
function makeInviteCode() {
  const random = crypto.randomBytes(5).toString('hex');
  return base32.encode(random);
}

/*
 * GET /admin/invites - admin interface for invites
 */
exports.invites = function (req, res) {
  InviteCode.find({})
    .populate('consumed_by_user')
    .sort({ _id: -1 })
    .exec(function (err, results) {
      results.forEach(function (invite) {
        invite.created = humane.humaneDate(invite.created_timestamp);
        invite.consumed = humane.humaneDate(invite.consumed_timestamp);
      });

      res.render('admin/invites.html', {
        invite_code: makeInviteCode(),
        invite_codes: results,
        version: pjson.version,
      });
    });
};

/*
 * GET /admin/users - admin interface for users
 */

exports.users = function (req, res) {
  User.find({})
    .sort({ _id: -1 })
    .exec(function (err, users) {
      res.render('admin/users.html', {
        flash: req.flash('admin'),
        version: pjson.version,
        users: users.map(function (user) {
          user.created_date = humane.humaneDate(utils.timeFromId(user.id));
          return user;
        }),
      });
    });
};

exports.makeAdmin = function (req, res) {
  if (!req.query.user) {
    return res.redirect('/admin/users');
  }
  users.makeAdmin(req.query.user, function (err) {
    if (err) {
      debug(err);
      return res.send(500, 'Error making admin user');
    }
    res.redirect('/admin/users');
  });
};

exports.removeUser = function (req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err || !user) {
      req.flash('admin', 'Failed to find user');
      return res.redirect('/admin/users');
    }
    Project.collection.remove(
      {
        creator: user._id,
      },
      function (err, number) {
        if (err) req.flash('admin', 'Failed to remove projects');
        req.flash('admin', `Removed ${number} projects owned by ${user.email}`);
        user.remove(function (err) {
          if (err) req.flash('admin', 'Failed to remove user');
          res.redirect('/admin/users');
        });
      }
    );
  });
};

/*
 * GET /admin/projects - admin interface for projects
 */

exports.projects = function (req, res) {
  projects.allProjects(function (err, projects) {
    if (err) return res.send(500, 'Error retrieving projects');
    res.render('admin/projects.html', {
      projects: projects,
      version: pjson.version,
    });
  });
};

/*
 * GET /admin/plugins
 * PUT /admin/plugins/:id */
exports.plugins = require('./plugins');

// XXX: what are we trying to do here??? - jaredly

/*
 * index.admin_job - build the admin job detail page
 * this is very similar although slightly different from the job function above.
 * at some point they should be refactored to combine redundant func.
 */
exports.job = function (req, res) {
  res.statusCode = 200;
  const org = req.params.org;
  const repo = req.params.repo;
  const jobId = req.params.job_id;
  let repoUrl = `https://github.com/${org}/${repo}`;

  repoUrl = repoUrl.toLowerCase();

  Step(
    function runQueries() {
      debug(`Querying for job id: ${jobId}`);
      Job.findById(jobId).populate('_owner').exec(this.parallel());

      debug(`Querying for last 20 jobs for ${repoUrl}`);
      Job.find()
        .sort({ finished_timestamp: -1 })
        .where('finished_timestamp')
        .ne(null)
        .where('repo_url', repoUrl)
        .where('type')
        .in(['TEST_ONLY', 'TEST_AND_DEPLOY'])
        .limit(20)
        .populate('_owner')
        .exec(this.parallel());
    },
    function processAndRender(err, resultsDetail, results) {
      if (err) throw err;

      results.forEach(function (job) {
        job.duration = Math.round(
          (job.finished_timestamp - job.created_timestamp) / 1000
        );
        job.finished_at = humane.humaneDate(job.finished_timestamp);
        if (job.github_commit_info.id !== undefined) {
          job.triggered_by_commit = true;
          job.gravatar_url = utils.gravatar(
            job.github_commit_info.author.email
          );

          if (job.github_commit_info.author.username !== undefined) {
            job.committer = job.github_commit_info.author.username;
            job.committer_is_username = true;
          } else {
            job.committer = job.github_commit_info.author.name;
            job.committer_is_username = false;
          }
        }
        job.url = `/admin/${org}/${repo}/job/${job.id}`;
      });

      // if resultsDetail did not return, that means this is not a valid job id
      if (resultsDetail === undefined) {
        res.render(404, 'invalid job id');
      } else {
        resultsDetail.duration = Math.round(
          (resultsDetail.finished_timestamp - resultsDetail.created_timestamp) /
            1000
        );
        resultsDetail.finished_at = humane.humaneDate(
          resultsDetail.finished_timestamp
        );

        let triggeredByCommit = false;

        if (resultsDetail.github_commit_info.id !== undefined) {
          triggeredByCommit = true;
          resultsDetail.gravatar_url = utils.gravatar(
            resultsDetail.github_commit_info.author.email
          );

          if (resultsDetail.github_commit_info.author.username !== undefined) {
            resultsDetail.committer =
              resultsDetail.github_commit_info.author.username;
            resultsDetail.committer_is_username = true;
          } else {
            resultsDetail.committer =
              resultsDetail.github_commit_info.author.name;
            resultsDetail.committer_is_username = false;
          }
        }

        resultsDetail.output = resultsDetail.stdmerged.replace(
          /\[(\d)?\d*m/gi,
          ''
        );

        const hasProdDeployTarget = false;
        const adminView = true;

        res.render('job.html', {
          admin_view: adminView,
          jobs: results,
          results_detail: resultsDetail,
          job_id: results[0].id.substr(0, 8),
          triggered_by_commit: triggeredByCommit,
          org: org,
          repo: repo,
          repo_url: repoUrl,
          has_prod_deploy_target: hasProdDeployTarget,
          version: pjson.version,
        });
      }
    }
  );
};
