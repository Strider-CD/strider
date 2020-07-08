'use strict';

var angular = require('angular');
var ansi = require('./filters/ansi');

angular.module('ansi', [])
  .filter('ansi', ansi);
