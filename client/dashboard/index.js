'use strict';

var angular = require('angular');
var interpolate = require('./configs/interpolate');

var app = angular.module('dashboard', ['moment'])
  .config(['$interpolateProvider', interpolate])
  .controller('Dashboard', ['$scope', '$element', DashboardController]);

module.exports = app;
