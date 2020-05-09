const Promise = require('bluebird');
const mongoose = require('mongoose');

mongoose.Promise = Promise;

module.exports = mongoose;
