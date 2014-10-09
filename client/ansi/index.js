'use strict';

var angular = require('angular');
var ansi = require('./filters/ansi');

var app = angular.module('ansi', [])
  .filter('ansi', ansi);
