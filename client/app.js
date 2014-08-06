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

app.controller('BranchesCtrl', require('./config/branches'));
