'use strict';

var angular = require('angular');
var interpolate = require('../utils/interpolate');
var ManualController = require('./controllers/manual');
var ProjectsController = require('./controllers/projects');

var app = angular.module('projects', ['alerts', 'moment', 'ui.bootstrap.buttons'])
  .config(['$interpolateProvider', interpolate])
  .controller('ManualController', ['$scope', '$attrs', ManualController])
  .controller('ProjectsController', ['$scope', ProjectsController])

module.exports = app; 
