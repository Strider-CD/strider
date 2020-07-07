require('./logging');
const auth = require('./auth');
const utils = require('./utils');
const common = require('./common');
const Project = require('./models').Project;
const User = require('./models').User;
module.exports = {
    bodySetter: bodySetter,
    requireBody: requireBody,
    custom404: custom404,
    anonProject: anonProject,
    project: project,
    projectPlugin: projectPlugin,
    projectProvider: projectProvider,
    // Legacy aliases - don't use these:
    require_auth: auth.requireUserOr401,
    require_auth_browser: auth.requireUser,
    require_admin: auth.requireAdminOr401,
    require_project_admin: auth.requireProjectAdmin,
};
// Custom middleware to save unparsed request body to req.content
function bodySetter(req, res, next) {
    if (req._post_body) {
        return next();
    }
    req.post_body = req.post_body || '';
    if ('POST' !== req.method) {
        return next();
    }
    req._post_body = true;
    req.on('data', function (chunk) {
        req.post_body += chunk;
    });
    next();
}
// Require the specified req.body parameters, or else return a 400 with a descriptive JSON body
function requireBody(paramsList) {
    return function (req, res, next) {
        const errors = [];
        let status = 'ok';
        for (let i = 0; i < paramsList.length; i++) {
            const val = req.body[paramsList[i]];
            if (!val) {
                errors.push(`required parameter \`${paramsList[i]}\` not found.`);
                status = 'error';
            }
        }
        if (errors.length === 0) {
            next();
        }
        else {
            return res.status(400).json({
                errors: errors,
                status: status,
            });
        }
    };
}
function custom404(req, res, next) {
    if (req.method !== 'GET') {
        return next();
    }
    res.statusCode = 404;
    res.render('doesnotexist.html');
}
// Create helper function to get or set the provifer config. Expects req.project
// `req.providerConfig` function
//   providerConfig() -> return the config
//   providerConfig(config, next(err)). save the config
//
// For hosted providers, the following function is also available
//   accountConfig() -> return the account confi
//   acountConfig(config, next(err)). save the account config
function projectProvider(req, res, next) {
    const project = req.project;
    req.providerConfig = function (config, next) {
        if (arguments.length === 0) {
            return project.provider.config;
        }
        project.provider.config = config;
        project.markModified('provider');
        project.save(next);
    };
    // make this conditional?
    if (project.provider.account) {
        const account = project.creator.account(project.provider.id, project.provider.account);
        req.accountConfig = function (config, next) {
            if (arguments.length === 0) {
                return account.config;
            }
            account.config = config;
            project.creator.markModified('accounts');
            project.creator.save(next);
        };
    }
    next();
}
// Get plugin config. Expects req.project
// Sets `req.pluginConfig` function
//   pluginConfig() -> return the config
//   pluginConfig(config, next(err)). save the config
function projectPlugin(req, res, next) {
    let pluginid;
    // if only 3 args, then get pluginid from params ":plugin"
    if (arguments.length === 4) {
        pluginid = req;
        req = res;
        res = next;
        next = arguments[3];
    }
    else {
        pluginid = req.params.plugin;
    }
    const branch = req.project.branch(req.query.branch);
    let plugin = null;
    if (!branch) {
        return res.status(404).send('Specified branch not found for the project');
    }
    // if it's just mirroring master
    if (branch.mirror_master) {
        return res.status(400).send('Branch not individually configurable');
    }
    for (let i = 0; i < branch.plugins.length; i++) {
        if (branch.plugins[i].id === pluginid) {
            plugin = branch.plugins[i];
            break;
        }
    }
    if (plugin === null) {
        return res.status(404).send('Plugin not enabled for the specified project');
    }
    req.pluginConfig = function (config, next) {
        if (arguments.length === 0) {
            return plugin.config;
        }
        plugin.config = config;
        req.project.markModified('branches');
        req.project.save(function (err) {
            next(err, config);
        });
    };
    req.userConfig = function (config, next) {
        if (!req.user.isProjectCreator) {
            if (arguments.length === 0) {
                return false;
            }
            return next(new Error('Current user is not the creator - cannot set the creator config'));
        }
        if (arguments.length === 0) {
            return req.project.creator.jobplugins[pluginid];
        }
        const schema = common.userConfigs.job && common.userConfigs.job[pluginid];
        if (!schema) {
            return next(new Error(`Plugin ${pluginid} doesn't define any user config`));
        }
        config = utils.validateAgainstSchema(config, schema);
        // TODO: validation
        req.project.creator.jobplugins[pluginid] = config;
        req.project.creator.markModified('jobplugins');
        req.project.creator.save(function (err) {
            next(err, config);
        });
    };
    next();
}
// just link project but doesn't fail if there's no auth
function anonProject(req, res, next) {
    let name = `${req.params.org}/${req.params.repo}`;
    name = name.toLowerCase();
    Project.findOne({ name: name })
        .populate('creator')
        .exec(function (err, project) {
        if (err) {
            return res.status(500).send({
                error: 'Failed to find project',
                info: err,
            });
        }
        if (!project) {
            return res.status(404).send('Project not found');
        }
        if (!project.creator) {
            return res
                .status(400)
                .send('Project malformed; project creator user is missing.');
        }
        req.project = project;
        req.accessLevel = User.projectAccessLevel(req.user, project);
        if (req.user && project.creator) {
            req.user.isProjectCreator =
                project.creator._id.toString() === req.user._id.toString();
        }
        next();
    });
}
// getProject Middleware
// assumes two url parameters, :org and :repo, and req.user
// checks user access level, and sets the following properties on the
// request object.
//
// req.project = the project
// req.accessLevel = -1 for no access, 0 for public, 1 for normal, 2 for admin
//
// Errors:
//   404: not found
//   401: not public and you don't have access
//   500: something strange happened w/ the DB lookup
function project(req, res, next) {
    if (req.params.org === 'auth') {
        return next();
    }
    anonProject(req, res, function () {
        if (req.accessLevel > -1) {
            return next();
        }
        if (!req.user) {
            req.session.return_to = req.url;
            return res.redirect('/login?ember=true');
        }
        res.status(401).send('Not authorized');
    });
}
//# sourceMappingURL=middleware.js.map