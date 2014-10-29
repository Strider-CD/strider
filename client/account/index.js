'use strict';

var angular = require('angular');
var AccountController = require('./controllers/account');
var ProviderController = require('./controllers/provider');
var JobController = require('./controllers/job');
var interpolate = require('../utils/interpolate');

var app = angular.module('account', ['alerts'])
  .config(['$interpolateProvider', interpolate])
  .controller('AccountController', ['$scope', '$sce', AccountController])
  .controller('Account.ProviderController', ['$scope', '$element', '$attrs', ProviderController])
  .controller('Account.JobController', ['$scope', '$element', '$attrs', JobController]);

module.exports = app;
