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

// Modules
require('./config');
require('./account');
require('./job-status');
require('./dashboard');

var app = angular.module('app', ['config', 'account', 'job-status', 'dashboard']);
