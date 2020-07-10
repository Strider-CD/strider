'use strict';

var Job = require('./job');

module.exports = {
  process: processBuildJob,
  Job: Job
};

function processBuildJob(data, provider, plugins, config, next) {
  var job = new Job(data, provider, plugins, config);
  
  return job.run(next);
}
