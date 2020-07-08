'use strict';

var $ = require('jquery');
var angular = require('angular');
var time = require('./directives/time');
var toggle = require('./directives/toggle');
var rawHtml = require('./directives/raw-html');
var percentage = require('./filters/percentage');

require('timeago');

// instead of "about %d hours"
$.timeago.settings.strings.hour = 'an hour';
$.timeago.settings.strings.hours = '%d hours';
$.timeago.settings.localeTitle = true;

var app = angular.module('moment', [])
  .directive('time', time)
  .directive('toggle', toggle)
  .directive('rawHtml', rawHtml)
  .filter('percentage', percentage);

module.exports = app;
