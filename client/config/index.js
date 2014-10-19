'use strict';

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
var interpolate = require('../utils/interpolate');
var ngSortableDirective = require('../utils/ng-sortable-directive');

var app = angular.module('config', ['ui.bootstrap', 'ui.codemirror', 'ui.sortable', 'alerts', 'moment'])
  .config(['$interpolateProvider', interpolate])
  .controller('Config', ['$scope', '$element', '$sce', ConfigController])
  .controller('Config.RunnerController', ['$scope', '$element', RunnerController])
  .controller('Config.ProviderController', ['$scope', ProviderController])
  .controller('Config.JobController', ['$scope', '$element', JobController])
  .controller('BranchesCtrl', ['$scope', BranchesController])
  .controller('CollaboratorsCtrl', ['$scope', CollaboratorsController])
  .controller('DeactivateCtrl', ['$scope', DeactivateController])
  .controller('HerokuController', ['$scope', HerokuController])
  .controller('GithubCtrl', ['$scope', GithubController])
  .directive('ngSortable', ['$parse', ngSortableDirective]);

module.exports = app;
