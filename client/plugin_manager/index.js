'use strict';

var angular = require('angular');

var PluginController = require('./controllers/plugin')
var PluginTableController = require('./controllers/plugin_table')

var app = angular.module('plugin_manager', [], function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
})
.controller('PluginController', ['$http', '$timeout', PluginController])
.controller('PluginTableController', [PluginTableController])

module.exports = app;
