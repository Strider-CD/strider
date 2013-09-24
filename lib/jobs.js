
var common = require('./common')
  , config = require('./config')
  , logging = require('./logging')
  , Job = require('./models').Job
  , User = require('./models').User
  , Project = require('./models').Project
  , filter = require('./ansi')
  , utils = require('./utils')

  , _ = require('underscore')
  , Step = require('step')
  , crypto = require('crypto')

var TEST_ONLY = "TEST_ONLY"
var TEST_AND_DEPLOY = "TEST_AND_DEPLOY"

function startJob(data, user, project) {
  // Create new Job object in Mongo and link to user
  var job = new Job(data)
  job.save(function (err, job) {
    var json = job.toJSON()
    json.project = project.toJSON()
    json.userProvider = user.providers[project.provider.id]
    common.emitter.emit('job.new', json)
  })
}

/**
  if (last){
    info.prev = []
    for (var i = 1; i< last.length; i++){
      info.prev.push({id: last[i]._id, stat: last[i].test_exitcode == 0 ? 'pass' : 'fail'})
    }
  }
  return info;
  **/

module.exports = {
  startJob: startJob
}
