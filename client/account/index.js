'use strict';

var angular = require('angular');
var AccountController = require('./controllers/account');
var ProviderController = require('./controllers/provider');
var JobController = require('./controllers/job');

var app = angular.module('account', ['alerts'], function ($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
})
.controller('AccountController', ['$scope', '$sce', AccountController])
.controller('ProviderController', ['$scope', '$element', '$attrs', ProviderController])
.controller('JobController', ['$scope', '$element', '$attrs', JobController]);

module.exports = app;
