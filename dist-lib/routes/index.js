const _ = require('lodash');
const common = require('../common');
const config = require('../config');
const debug = require('debug')('strider:routes');
const jobs = require('../jobs');
const models = require('../models');
const path = require('path');
const pjson = require('../../package.json');
const User = models.User;
const utils = require('../utils');
/*
 * GET home page dashboard
 */
exports.index = function (req, res) {
    // Work-around for Safari/Express etags bug on cookie logout.
    // Without it, Safari will cache the logged-in version despite logout!
    // See https://github.com/Strider-CD/strider/issues/284
    req.headers['if-none-match'] = 'no-match-for-this';
    if (req.session.return_to) {
        const return_to = req.session.return_to;
        req.session.return_to = null;
        return res.redirect(return_to);
    }
    let code = '';
    if (req.query.code !== undefined) {
        code = req.query.code;
        return res.render('register.html', {
            invite_code: code,
            version: pjson.version,
        });
    }
    jobs.latestJobs(req.user, true, function (err, jobs) {
        const availableProviders = Object.keys(common.userConfigs.provider).map(function (k) {
            return common.userConfigs.provider[k];
        });
        res.render('index.html', {
            jobs: jobs,
            availableProviders: availableProviders,
            flash: req.flash(),
            version: pjson.version,
        });
    });
};
exports.emberIndex = function (req, res) {
    // Work-around for Safari/Express etags bug on cookie logout.
    // Without it, Safari will cache the logged-in version despite logout!
    // See https://github.com/Strider-CD/strider/issues/284
    req.headers['if-none-match'] = 'no-match-for-this';
    if (req.session.return_to) {
        const return_to = req.session.return_to;
        req.session.return_to = null;
        return res.redirect(return_to);
    }
    if (req.query.ember) {
        return jobs.latestJobs(req.user, true, function (err, jobs) {
            const availableProviders = Object.keys(common.userConfigs.provider).map(function (k) {
                return common.userConfigs.provider[k];
            });
            // TODO: only set if dev
            res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
            res.render('dist/index.html', { jobs, availableProviders });
        });
    }
};
exports.setConfig = function (req, res) {
    const attrs = ['public'];
    applyAttrs(req.project, attrs, req.body);
    req.project.save(function (err) {
        if (err)
            return res.status(500).send('failed to save project');
        res.send('saved');
    });
};
exports.getRunnerConfig = function (req, res) {
    const branch = req.project.branch(req.query.branch);
    if (!branch) {
        return res.status(400).send('Invalid branch');
    }
    res.send(branch.runner);
};
exports.setRunnerConfig = function (req, res) {
    const branch = req.project.branch(req.query.branch);
    branch.runner.config = req.body;
    req.project.save(function (err, project) {
        if (err) {
            return res.status(500).send({
                error: 'Failed to save runner config',
            });
        }
        res.send(project.branch(req.query.branch).runner.config);
    });
};
exports.setRunnerId = function (req, res) {
    const branch = req.project.branch(req.query.branch);
    branch.runner.id = req.body.id;
    branch.runner.config = req.body.config;
    req.project.save(function (err, project) {
        if (err) {
            return res.status(500).send({
                error: 'Failed to save runner config',
            });
        }
        res.send(project.branch(req.query.branch).runner.id);
    });
};
// GET /:org/:repo/config/branch/:pluginname/?branch=:branch
// Output: the config
exports.getPluginConfig = function (req, res) {
    res.send(req.pluginConfig());
};
// POST /:org/:repo/config/branch/:plugin/?branch=:branch
// Set the configuration for a plugin on a branch. Output: the new config.
exports.setPluginConfig = function (req, res) {
    req.pluginConfig(req.body, function (err, config) {
        if (err) {
            return res.status(500).send({
                error: 'Failed to save plugin config',
            });
        }
        res.send(config);
        common.emitter.emit('branch.plugin_config', req.project, req.query.branch, req.params.plugin, req.body);
    });
};
exports.configureBranch = function (req, res) {
    const branch = req.project.branch(req.query.branch);
    if (!branch) {
        return res.status(400).send('Invalid branch');
    }
    if (req.body.plugin_order) {
        return setPluginOrder(req, res, branch);
    }
    // TODO: move this somewhere else?
    const attrs = [
        'active',
        'privkey',
        'pubkey',
        'envKeys',
        'mirror_master',
        'deploy_on_green',
        'deploy_on_pull_request',
        'runner',
        'plugins',
    ];
    applyAttrs(branch, attrs, req.body);
    req.project.save(function (err) {
        if (err) {
            return res.status(500).send('failed to save project');
        }
        res.status(200).send('saved');
    });
};
function setPluginOrder(req, res, branch) {
    const plugins = req.body.plugin_order;
    const oldPlugins = branch.plugins || [];
    const map = {};
    oldPlugins.forEach(function (plugin) {
        map[plugin.id] = plugin;
    });
    plugins.forEach(function (plugin) {
        if (map[plugin.id]) {
            plugin.config = map[plugin.id].config;
        }
        else {
            plugin.config = {};
        }
    });
    branch.plugins = plugins;
    req.project.markModified('branches');
    req.project.save(function (err) {
        if (err) {
            return res.status(500).send('Failed to save plugin config');
        }
        res.send({ success: true });
        common.emitter.emit('branch.plugin_order', req.project, branch.name, plugins);
    });
}
exports.reloadConfig = function (req, res, next) {
    common.loader.initConfig(path.join(__dirname, 'public/javascripts/pages/config-plugins-compiled.js'), path.join(__dirname, 'public/stylesheets/css/config-plugins-compiled.css'), function (err, configs) {
        debug('loaded config pages');
        common.pluginConfigs = configs;
        common.loader.initUserConfig(path.join(__dirname, 'public/javascripts/pages/account-plugins-compiled.js'), path.join(__dirname, 'public/stylesheets/css/account-plugins-compiled.css'), function (err, configs) {
            debug('loaded account config pages');
            common.userConfigs = configs;
            next();
        });
    });
};
/*
 * GET /:org/:repo/config - project config page
 */
exports.config = function (req, res) {
    User.collaborators(req.project.name, 0, function (err, users) {
        if (err) {
            throw err;
        }
        const data = {
            version: pjson.version,
            collaborators: [],
            serverName: config.server_name,
            project: req.project.toJSON(),
            statusBlocks: common.statusBlocks,
            userIsCreator: req.user.isProjectCreator,
        };
        if (req.user.isProjectCreator) {
            data.userConfigs = req.user.jobplugins;
        }
        delete data.project.creator;
        users.forEach(function (user) {
            const p = _.find(user.projects, function (p) {
                return p.name === req.project.name;
            });
            data.collaborators.push({
                email: user.email,
                access: p.access_level,
                gravatar: utils.gravatar(user.email),
                owner: user._id.toString() === req.project.creator._id.toString(),
                yourself: req.user._id.toString() === user._id.toString(),
            });
        });
        data.provider = common.pluginConfigs.provider[req.project.provider.id];
        data.runners = common.pluginConfigs.runner;
        data.plugins = common.pluginConfigs.job;
        data.collaborators.sort(function (a, b) {
            if (a.owner)
                return -1;
            if (b.owner)
                return 1;
            return 0;
        });
        const provider = common.extensions.provider[req.project.provider.id];
        const creator_creds = req.project.creator.account(req.project.provider)
            .config;
        if (!provider) {
            // TODO: alert the user through the UI
            debug('Provider plugin not installed!', req.project.provider.id);
            return respond(data);
        }
        if (typeof provider.getBranches === 'function' &&
            (!provider.hosted || creator_creds)) {
            provider.getBranches(creator_creds, req.project.provider.config, req.project, function (err, branches) {
                data.allBranches = branches;
                respond(data);
            });
        }
        else {
            respond(data);
        }
    });
    function respond(data) {
        res.format({
            html: function () {
                res.render('project_config.html', data);
            },
            json: function () {
                res.send(data);
            },
        });
    }
};
/*
 * /status endpoint
 * Executes a simple database query to verify that system is operational.
 * Assumes there is at least 1 user in the system.
 * Returns 200 on success.
 *
 * This is for use by Pingdom and similar monitoring systems.
 */
exports.status = function (req, res) {
    function error(message) {
        res.statusCode = 500;
        const resp = {
            status: 'error',
            version: `StriderCD (http://stridercd.com) ${pjson.version}`,
            results: [],
            errors: [{ message: message }],
        };
        return res.jsonp(resp);
    }
    function ok() {
        res.statusCode = 200;
        const resp = {
            status: 'ok',
            version: `StriderCD (http://stridercd.com) ${pjson.version}`,
            results: [{ message: 'system operational' }],
            errors: [],
        };
        return res.jsonp(resp);
    }
    User.findOne(function (err, user) {
        if (err) {
            return error(`error retrieving user from DB: ${err}`);
        }
        if (!user) {
            return error('no users found in DB - mis-configured?');
        }
        return ok();
    });
};
function applyAttrs(obj, attrs, source) {
    attrs.forEach(function (attr) {
        if (typeof source[attr] !== 'undefined') {
            obj[attr] = source[attr];
        }
    });
}
//# sourceMappingURL=index.js.map