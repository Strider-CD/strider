
module.exports = function (testname, params, req, done) {
  var data = require('./basic.json')
    , name = params.org + '/' + params.repo
  data.project.name = name
  for (var i=0; i<data.jobs.length; i++) {
    data.jobs[i].project = name
  }
  done(null, data)
}
  
