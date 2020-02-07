'use strict';

var Promise = require('bluebird');
var mongoose = require('mongoose');

mongoose.Promise = Promise;

module.exports = mongoose;
