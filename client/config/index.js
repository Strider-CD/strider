/* global md5: true, bootbox: true, ngSortableDirective: true */

var angular = require('angular');
var RunnerController = require('./controllers/runner');
var ProviderController = require('./controllers/provider');
var JobController = require('./controllers/job');
var ConfigController = require('./controllers/config');
var BranchesController = require('./controllers/branches');
var CollaboratorsController = require('./controllers/collaborators');
var DeactivateController = require('./controllers/deactivate');
var HerokuController = require('./controllers/heroku');
var GithubController = require('./controllers/github');

var app = angular.module('config', ['ui.bootstrap', 'ui.codemirror', 'ui.sortable', 'Alerts', 'moment'], function ($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
})
.controller('Config', ['$scope', '$element', '$sce', ConfigController])
.controller('RunnerController', ['$scope', '$element', RunnerController])
.controller('ProviderController', ['$scope', ProviderController])
.controller('JobController', ['$scope', '$element', JobController])
.controller('BranchesCtrl', ['$scope', BranchesController]);
.controller('CollaboratorsCtrl', ['$scope', CollaboratorsController])
.controller('DeactivateCtrl', ['$scope', DeactivateController])
.controller('HerokuCtrl', ['$scope', HerokuController])
.controller('GithubCtrl', ['$scope', GithubController])
.directive('ngSortable', ngSortableDirective);

module.exports = app;
