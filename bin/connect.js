'use strict';

function connect(cb) {
  var mongoose = require('mongoose');
  var mongodbUrl = require('../lib/config').db_uri;

  console.log('Connecting to MongoDB URL: %s\n', mongodbUrl);
  mongoose.connect(mongodbUrl, cb);
}

module.exports = connect;
