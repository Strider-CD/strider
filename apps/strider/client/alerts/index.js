'use strict';

var angular = require('angular');
var AlertsController = require('./controllers/alerts');

var app = angular.module('alerts', [])
  .controller('AlertsController', ['$scope', '$sce', AlertsController]);

module.exports = app;
