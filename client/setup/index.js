'use strict';

var angular = require('angular');
var interpolate = require('../utils/interpolate');
var SetupController = require('./controllers/setup');

require('angular-wizard');

var app = angular.module('setup', ['mgo-angular-wizard'])
  .config(['$interpolateProvider', interpolate])
  .controller('Setup', ['$scope', '$element', SetupController]);

module.exports = app;
