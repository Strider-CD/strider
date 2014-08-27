'use strict';

require('bootstrap');

var $ = require('jquery');
var angular = require('angular');
var ngRoute = require('angular-route');
var _ = require('lodash');
var $navbar = $('.navbar');

$navbar.find('li').removeClass('active');
$navbar.find('a[href="' + global.location.pathname + '"]')
  .parent().addClass('active');

// Third party
require('ui-bootstrap');
require('ui-codemirror');
require('ui-sortable');

// Modules
require('./config');
require('./account');
require('./job-status');
require('./dashboard');
require('./projects');

// Shared?
require('./alerts');
require('./ansi');
require('./moment');

var app = angular.module('app', ['config', 'account', 'job-status', 'dashboard', 'projects']);

// For access from plugins, need a better way
global.app = app;
global.$ = $;
