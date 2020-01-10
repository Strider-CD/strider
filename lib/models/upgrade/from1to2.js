'use strict';

var models = require('../');
var Project = models.Project;

module.exports = function (done) {
  var newBranch = {
    name: '*',
    mirror_master: true
  };

  var update = {$push: {branches: newBranch}};
  var options = {multi: true};

  Project.updateMany({}, update, options, done);
};
