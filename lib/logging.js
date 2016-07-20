'use strict';

var util = require('util');
var winston = require('winston');
var config = require('./config');

var transports = [];
var logger;

if (config.logging.console_enabled) {
  transports.push(new winston.transports.Console(config.logging.console));
}

if (config.logging.file_enabled) {
  transports.push(new winston.transports.File(config.logging.file));
}

logger = new winston.Logger({
  transports: transports,
  exitOnError: config.logging.exitOnError
});

function formatArgs(args){
  return [util.format.apply(util.format, Array.prototype.slice.call(args))];
}

console.log = function (){
  logger.info.apply(logger, formatArgs(arguments));
};

console.debug = function (){
  logger.debug.apply(logger, formatArgs(arguments));
};
console.info = function (){
  logger.info.apply(logger, formatArgs(arguments));
};
console.warn = function (){
  logger.warn.apply(logger, formatArgs(arguments));
};
console.error = function (){
  logger.error.apply(logger, formatArgs(arguments));
};

module.exports = logger;
