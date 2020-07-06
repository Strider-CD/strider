const path = require('path');
const passport = require('passport');
const async = require('async');
const Loader = require('strider-extension-loader');
const globalTunnel = require('global-tunnel');
const app = require('./app');
const common = require('./common');
const config = require('./config');
const middleware = require('./middleware');
const auth = require('./auth');
const models = require('./models');
const pluginTemplates = require('./plugin-templates');
const upgrade = require('./models/upgrade').ensure;
const loadExtensions = require('./utils/load-extensions');
const killZombies = require('./utils/kill-zombies');
const registerPanel = require('./utils/register-panel');
const Job = models.Job;
const Config = models.Config;
common.extensions = {};
//
// Use globa-tunnel to provide proxy support.
// The http_proxy environment variable will be used if the first parameter to globalTunnel.initialize is null.
//
globalTunnel.initialize();
module.exports = function (extdir, c, callback) {
    const appConfig = config;
    let k;
    // override with c
    for (k in c) {
        appConfig[k] = c[k];
    }
    // Initialize the (web) app
    const appInstance = app.init(appConfig);
    const cb = callback || defaultCallback;
    function defaultCallback(err) {
        if (err) {
            throw err;
        }
    }
    if (typeof Loader !== 'function') {
        throw new Error('Your version of strider-extension-loader is out of date');
    }
    const loader = new Loader([path.join(__dirname, '../client/styles')], true);
    appInstance.loader = loader;
    common.loader = loader;
    //
    // ### Strider Context Object
    //
    // Context object is passed to each extension.  It carries various config
    // settings, as well as handles to enable functions to register things.
    // Context can also be accessed as a singleton within Strider as
    // common.context.
    const context = {
        serverName: appConfig.server_name,
        config: appConfig,
        enablePty: config.enablePty,
        emitter: common.emitter,
        extensionRoutes: [],
        extensionPaths: extdir,
        extdir: extdir,
        loader: loader,
        models: models,
        logger: console,
        middleware: middleware,
        auth: auth,
        passport: passport,
        registerPanel: registerPanel(common),
        registerBlock: pluginTemplates.registerBlock,
        app: appInstance,
    };
    // Make extension context available throughout application.
    common.context = context;
    const SCHEMA_VERSION = Config.SCHEMA_VERSION;
    upgrade(SCHEMA_VERSION, function (err) {
        if (err) {
            return cb(err);
        }
        loadExtensions(loader, extdir, context, appInstance, function () {
            // kill zombie jobs
            killZombies(function () {
                const tasks = [];
                if (!common.extensions.runner ||
                    typeof common.extensions.runner !== 'object') {
                    console.error('Strider seems to have been misconfigured - there are no available runner plugins. ' +
                        'Please make sure all dependencies are up to date.');
                    process.exit(1);
                }
                Object.keys(common.extensions.runner).forEach(function (name) {
                    const runner = common.extensions.runner[name];
                    if (!runner) {
                        console.log('no runner', name);
                        return;
                    }
                    tasks.push(function (next) {
                        Job.find({
                            'runner.id': name,
                            finished: null,
                        }, function (error, jobs) {
                            if (error) {
                                return next(error);
                            }
                            runner.findZombies(jobs, next);
                        });
                    });
                });
                async.parallel(tasks, function (err, zombies) {
                    if (err)
                        return cb(err);
                    const ids = [].concat.apply([], zombies).map(function (job) {
                        return job._id;
                    });
                    const now = new Date();
                    Job.updateOne({ _id: { $in: ids } }, {
                        $set: {
                            finished: now,
                            errored: true,
                            error: { message: 'Job timeout', stack: '' },
                        },
                    }, function () {
                        Job.updateOne({ _id: { $in: ids }, started: null }, { $set: { started: now } }, function (err) {
                            cb(err, appInstance);
                        });
                    });
                });
            });
        });
    });
    return appInstance;
};
//# sourceMappingURL=index.js.map