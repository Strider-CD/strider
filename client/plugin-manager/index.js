'use strict';

var angular = require('angular');

var PluginController = require('./controllers/plugin');
var PluginTableController = require('./controllers/plugin-table');
var interpolate = require('../utils/interpolate');

var app = angular.module('plugin-manager', [])
  .config(['$interpolateProvider', interpolate])
  .controller('PluginController', ['$http', '$timeout', PluginController])
  .controller('PluginTableController', [PluginTableController]);

module.exports = app;
