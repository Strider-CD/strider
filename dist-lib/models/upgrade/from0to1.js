var models = require('../');
var Job = models.Job;
var User = models.User;
var Project = models.Project;
var async = require('async');
var utils = require('../../utils');
module.exports = function (done) {
    upgradeUsers(function (err) {
        if (err)
            return done(err);
        upgradeJobs(done);
    });
};
function upgradeJobs(done) {
    Job.collection.find({}, function (err, cursor) {
        if (err)
            return done(err);
        cursor.toArray(function (err, jobs) {
            if (err)
                return done(err);
            console.log('converting', jobs.length, 'jobs');
            var tasks = [];
            jobs.forEach(function (job) {
                tasks.push(function (next) {
                    upgradeJob(job, next);
                });
            });
            async.series(tasks, done);
        });
    });
}
function upgradeJob(job, done) {
    Job.findById(job._id)
        .lean()
        .exec(function (err, mjob) {
        if (err)
            return done(err);
        mjob.user_id = job._owner;
        mjob.project = makeName(job.repo_url);
        mjob.ref = {
            branch: 'master'
        };
        if (job.github_commit_info) {
            mjob.ref.id = job.github_commit_info.id;
        }
        mjob.std = {
            out: job.stdout || '',
            err: job.stderr || '',
            merged: job.stdmerged || ''
        };
        mjob.created = job.created_timestamp;
        mjob.finished = job.finished_timestamp;
        mjob.queued = mjob.created;
        mjob.started = mjob.created;
        mjob.duration = mjob.finished
            ? mjob.finished.getTime() - mjob.created.getTime()
            : 0;
        mjob.archived = job.archived_timestamp;
        mjob.trigger = makeTrigger(job, job.github_commit_info);
        mjob.plugin_data = {};
        if (job.tasks && job.tasks.length) {
            mjob.plugin_data.sauce = job.tasks;
        }
        killAttrs(mjob, [
            'created_timestamp',
            'finished_timestamp',
            'archived_timestamp',
            '_owner',
            'repo_url',
            'stdout',
            'stderr',
            'stdmerged',
            'tasks'
        ]);
        mjob.phases = {
            environment: {
                commands: []
            },
            prepare: {
                commands: []
            },
            test: {
                finished: mjob.finished,
                duration: mjob.duration,
                exitCode: mjob.test_exitcode,
                commands: [
                    {
                        started: mjob.started,
                        duration: mjob.duration,
                        command: 'Legacy job output',
                        out: mjob.std.out,
                        err: mjob.std.err,
                        merged: mjob.std.merged
                    }
                ]
            },
            deploy: {
                commands: []
            },
            cleanup: {
                commands: []
            }
        };
        Job.collection.updateOne({ _id: job._id }, mjob, done);
        console.log('done job', job._id);
    });
}
function makeTrigger(job, commit) {
    if (!commit) {
        return {
            type: 'manual',
            author: {
                id: job._owner
                // TODO get more info about the user? Like email, gravatar, etc
            },
            message: job.type === 'TEST_AND_DEPLOY' ? 'Redeploy' : 'Retest',
            timestamp: job.created_timestamp,
            source: { type: 'UI', page: 'Unknown' }
        };
    }
    commit.author.image = utils.gravatar(commit.author.email);
    return {
        type: 'commit',
        author: commit.author,
        message: commit.message,
        timestamp: commit.timestamp,
        url: `${job.repo_url}/commit/${commit.id}`,
        source: { type: 'plugin', plugin: 'github' }
    };
}
function upgradeUsers(done) {
    User.collection.find({}, function (err, cursor) {
        if (err)
            return done(err);
        cursor.toArray(function (err, users) {
            if (err)
                return done(err);
            console.log('converting users', users.length);
            var tasks = [];
            users.forEach(function (user) {
                tasks.push(function (next) {
                    upgradeUser(user, next);
                });
            });
            async.series(tasks, done);
        });
    });
}
function makeGithubRepos(user) {
    if (!user.github)
        return [];
    var github = user.github_metadata[user.github.id].repos;
    var repos = [];
    for (var i = 0; i < github.length; i++) {
        repos.push({
            id: `${github[i].id}`,
            name: github[i].full_name && github[i].full_name.toLowerCase(),
            display_name: github[i].full_name,
            group: github[i].owner.login,
            display_url: github[i].html_url,
            config: {
                url: `git://${github[i].clone_url.split('//')[1]}`,
                owner: github[i].owner.login,
                repo: github[i].name,
                auth: {
                    type: 'https'
                }
            }
        });
    }
    return repos;
}
// remove attributes from a model
function killAttrs(model, attrs) {
    for (var i = 0; i < attrs.length; i++) {
        delete model[attrs[i]];
    }
}
function makeHerokuAccounts(user) {
    if (!user.heroku || !user.heroku.length)
        return { accounts: [], apps: {} };
    var keys = {};
    var accounts = [];
    var caches = {};
    var apps = {};
    user.heroku.forEach(function (account) {
        var aid = account.account_id.split('@')[0];
        if (keys[account.api_key]) {
            aid = keys[account.api_key];
        }
        else {
            caches[account.api_key] = [];
        }
        apps[account.account_id] = {
            id: account.account_id.split('@')[0].split('-')[1],
            name: account.app,
            account: aid,
            git_url: `git@heroku.com:${account.app}.git`,
            web_url: `http://${account.app}.herokuapp.com/`
        };
        caches[account.api_key].push(apps[account.account_id]);
        if (keys[account.api_key]) {
            return;
        }
        keys[account.api_key] = aid;
        accounts.push({
            id: aid,
            api_key: account.api_key,
            email: aid,
            privkey: account.privkey,
            pubkey: account.pubkey,
            cache: caches[account.api_key]
        });
    });
    return {
        accounts: accounts,
        apps: apps
    };
}
function upgradeUser(user, done) {
    User.findById(user._id)
        .lean()
        .exec(function (err, mongUser) {
        var heroku = makeHerokuAccounts(user);
        mongUser.accounts = [];
        if (user.github && user.github.id) {
            mongUser.accounts.push({
                provider: 'github',
                id: user.github.id,
                display_url: `https://github.com/${user.github.login}`,
                title: user.github.login,
                config: convertGithub(user),
                cache: makeGithubRepos(user)
            });
        }
        mongUser.jobplugins = {
            heroku: {
                accounts: heroku.accounts
            }
        };
        mongUser.projects = [];
        killAttrs(mongUser, [
            'github',
            'github_config',
            'github_metadata',
            'dotcloud_config',
            'heroku'
        ]);
        var projects = [];
        if (user.github_config && user.github_config.length > 0) {
            for (var i = 0; i < user.github_config.length; i++) {
                var repo_config = user.github_config[i];
                var name = makeName(repo_config.display_url);
                mongUser.projects.push({
                    name: name.toLowerCase(),
                    display_name: name,
                    access_level: 2
                });
                projects.push(makeProject(name, repo_config, user, heroku));
            }
        }
        Project.create(projects, function (err) {
            if (err)
                return done(err);
            User.collection.updateOne({ _id: mongUser._id }, mongUser, done);
        });
        console.log('projects', projects.length, user._id);
    });
}
function makeName(url) {
    return url
        .split('/')
        .slice(-2)
        .join('/')
        .split('.')[0];
}
function makeProvider(name, repo, user) {
    // TODO: how do I know if it's not github?
    var parts = name.split('/');
    var repos = user.github_metadata[user.github.id].repos;
    var url = `git://${repo.display_url.split('//')[1]}.git`;
    var id = null;
    for (var i = 0; i < repos.length; i++) {
        if (repos[i].html_url === repo.display_url) {
            id = repos[i].id;
            url = `git://${repos[i].git_url.split('//')[1]}`;
            break;
        }
    }
    return {
        id: 'github',
        repo_id: id,
        account: user.github.id,
        config: {
            url: url,
            owner: parts[0],
            repo: parts[1],
            auth: {
                type: 'https'
                // with no username specified,
            }
        }
    };
}
// plugins that we need:
// node
//
// Optional:
// browserstack
// webhooks
// heroku
// custom
// env
// jelly
// qunit
// sauce
var checkPlugins = {
    sauce: function (repo) {
        if (!repo.sauce_access_key)
            return;
        return {
            access_key: repo.sauce_access_key,
            username: repo.sauce_username,
            browsers: repo.sauce_browsers
        };
    },
    qunit: function (repo) {
        if (!repo.qunit_file)
            return;
        return {
            file: repo.qunit_file,
            path: repo.qunit_path
        };
    },
    jelly: function (repo) {
        if (!repo.jelly_payload)
            return;
        return {
            url: repo.jelly_url,
            port: repo.jelly_port,
            payload: repo.jelly_payload,
            static: repo.jelly_static,
            static_dir: repo.jelly_static_dir
        };
    },
    env: function (repo) {
        return repo.env;
    },
    custom: function (repo) {
        return repo.custom;
    },
    heroku: function (repo, user, heroku) {
        if (!repo.prod_deploy_target ||
            repo.prod_deploy_target.provider !== 'heroku')
            return;
        var account_id = repo.prod_deploy_target.account_id;
        return { app: heroku.apps[account_id] };
    },
    webhooks: function (repo) {
        if (!repo.webhooks || !repo.webhooks.length)
            return;
        var hooks = [];
        var hook;
        for (var i = 0; i < repo.webhooks.length; i++) {
            hook = repo.webhooks[i];
            hooks.push({
                id: hook._id,
                url: hook.url,
                secret: hook.secret,
                format: '',
                trigger: 'job.done'
            });
        }
        return hooks;
    },
    browserstack: function (repo) {
        if (!repo.browserstack_api_key)
            return;
        return {
            apiKey: repo.browserstack_api_key,
            username: repo.browserstack_username,
            password: repo.browserstack_password,
            browsers: repo.browserstack_browsers
        };
    }
};
function makePlugins(repo, user, heroku) {
    var plugins = [
        {
            id: 'node',
            enabled: true,
            config: {
                test: 'npm install',
                runtime: 'whatever'
            }
        }
    ];
    Object.keys(checkPlugins).forEach(function (name) {
        var config = checkPlugins[name](repo, user, heroku);
        if (!config)
            return;
        plugins.push({
            id: name,
            enabled: true,
            config: config
        });
    });
    return plugins;
}
function makeBranch(repo, user, heroku) {
    return {
        active: repo.active,
        name: 'master',
        mirror_master: false,
        deploy_on_green: repo.prod_deploy_target && repo.prod_deploy_target.deploy_on_green,
        deploy_on_pull_request: false,
        pubkey: repo.pubkey,
        privkey: repo.privkey,
        plugins: makePlugins(repo, user, heroku),
        plugin_data: {},
        runner: {
            id: 'simple-runner',
            config: {
                pty: false
            }
        }
    };
}
function makeProject(name, repo, user, heroku) {
    return {
        name: name.toLowerCase(),
        secret: repo.secret,
        public: repo.public,
        display_name: name,
        display_url: repo.display_url,
        creator: user._id,
        branches: [makeBranch(repo, user, heroku)],
        provider: makeProvider(name, repo, user)
    };
}
function convertGithub(user) {
    if (!user.github)
        return {};
    var g = user.github;
    return {
        accessToken: g.accessToken,
        login: g.login,
        email: g.email,
        gravatarId: g.gravatarId,
        name: g.name
    };
}
//# sourceMappingURL=from0to1.js.map