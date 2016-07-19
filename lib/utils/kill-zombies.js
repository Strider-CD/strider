'use strict';

var debug = require('debug')('strider:kill-zombies');
var Job = require('../models/job');

module.exports = function killZombies(done) {
  debug('Marking zombie jobs as finished...');

  Job.update({
    archived: null,
    finished: null
  }, {
    $set: {
      finished: new Date(),
      errored: true
    }
  }, {
    multi: true
  }, function(err, count) {
      if (err) throw err;
      debug('%d zombie jobs marked as finished', count);
      done();
    }
  );
};
