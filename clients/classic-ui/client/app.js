'use strict';

require('bootstrap');

var $ = require('jquery');
var _ = require('lodash');
var angular = require('angular');
var $navbar = $('.navbar');

require('angular-route');

$navbar.find('li').removeClass('active');
$navbar.find(`a[href="${global.location.pathname}"]`)
  .parent().addClass('active');
$('#layout-header').hide();
$('#invite-box').height($('#signup-box').height());

// Third party
require('ui-bootstrap');
require('ui-codemirror');

// Modules
require('./account');
require('./config');
require('./plugin-manager');
require('./job-status');
require('./dashboard');
require('./projects');

// Shared?
require('./alerts');
require('./ansi');
require('./moment');

var app = angular.module('app', [
  'config',
  'account',
  'plugin-manager',
  'job-status',
  'dashboard',
  'projects'
]);

// For access from plugins, need a better way
global.app = app;
global.$ = $;
global.angular = angular;
global._ = _;
