'use strict';

module.exports = function (deps, parser) {
  const pruneJobs = require('../lib/prune-jobs')(deps);

  parser
    .command('pruneJobs')
    .option('project', {
      abbr: 'p',
      help: 'Project to target, defaults to all projects if not specified',
    })
    .option('keepJobs', {
      abbr: 'k',
      help: 'Number of latest jobs to keep',
      default: 20,
    })
    .option('dryRun', {
      abbr: 'd',
      help:
        'Just print stats about what will be removed, but do not remove any jobs',
      flag: true,
      default: false,
    })
    .callback(function (opts) {
      deps.connect(function (err) {
        if (err) {
          throw err;
        }

        pruneJobs(opts.keepJobs, opts.project, opts.dryRun);
      });
    })
    .help('Cleanup all jobs except for the latest 20 or custom');
};
