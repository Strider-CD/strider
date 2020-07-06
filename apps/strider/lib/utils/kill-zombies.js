const debug = require('debug')('strider:kill-zombies');
const Job = require('../models/job').default;

module.exports = function killZombies(done) {
  debug('Marking zombie jobs as finished...');

  Job.updateMany(
    {
      archived: null,
      finished: null,
    },
    {
      $set: {
        finished: new Date(),
        errored: true,
      },
    },
    {
      multi: true,
    },
    function (err, count) {
      if (err) throw err;
      debug('%d zombie jobs marked as finished', count.nModified);
      done();
    }
  );
};
