// TODO: go through this comment
/* globals bootbox: true, io: true, SKELS: true, job: true */
'use strict';

var angular = require('angular');
var routes = require('./configs/routes.js');
var pluginStatus = require('./directives/plugin-status');
var JobController = require('./controllers/job');

var app = angular.module('job-status', ['moment', 'ansi', 'ngRoute'])
  .config(['$interpolateProvider', '$locationProvider', '$routeProvider', routes])
  .controller('JobCtrl', ['$scope', '$route', '$location', '$filter', JobController])
  .directive('pluginStatus', pluginStatus);

module.exports = app;
