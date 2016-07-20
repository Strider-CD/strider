
var models = require('../lib/models')
  , mongoose = require('mongoose')
  , mongodbUrl = process.env.STRIDER_TEST_DB || 'mongodb://localhost/strider-foss'
  , fs = require('fs')
  , async = require('async');

mongoose.connect(mongodbUrl);

function upFixture(name, items, done) {
  var fileName = 'fixtures/' + name + '.json';
  fs.readFile(fileName, 'utf8', function (err, text) {
    if (err) return done(err);
    var data = JSON.parse(text);
    if (!Array.isArray(data)) data = [];
    data = data.concat(items);
    fs.writeFile(fileName, JSON.stringify(data), function (err) {
      done(err);
    });
  });
}

function getJob(done) {
  models.Job.find({project: 'strider-cd/test-node'}, function (err, jobs) {
    if (err) return done(err);
    console.log('found', jobs.length);
    upFixture('jobs', jobs, done);
  });
}

function getProjects(done) {
  models.Project.findOne({name: 'strider-cd/test-node'}, function (err, project) {
    if (err) return done(err);
    upFixture('projects', [project], done);
  });
}

async.parallel([getProjects], function (err) {
  if (err) console.error('Failed', err);
  process.exit(err ? 1 : 0);
});

