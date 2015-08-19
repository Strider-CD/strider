'use strict';

var Job = require('../models/job');

module.exports = function killZombies(done) {
  console.log('Marking zombie jobs as finished...');

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
      console.log('%d zombie jobs marked as finished', count);
      done();
    }
  );
};
