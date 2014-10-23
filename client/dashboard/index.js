'use strict';

var angular = require('angular');
var interpolate = require('../utils/interpolate');
var DashboardController = require('./controllers/dashboard');

var app = angular.module('dashboard', ['moment'])
  .config(['$interpolateProvider', interpolate])
  .controller('Dashboard', ['$scope', '$element', DashboardController]);

module.exports = app;
