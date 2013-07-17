
var filter = require('./ansi')

module.exports.sanitizeJob = function (job) {
  var njob = {_owner: {}}
    , skip = ['_owner', 'stdmerged', 'stdout', 'stderr']
    , oskip = ['github_config', 'github_metadata', 'github', 'heroku']
    , name;
  for (name in job) {
    if (skip.indexOf(name) !== -1) continue;
    njob[name] = job[name];
  }
  for (name in job._owner) {
    if (oskip.indexOf(name) !== -1) continue;
    njob._owner[name] = job._owner[name];
  }
  njob.output = job.stdmerged ? filter(job.stdmerged) : '';
  return njob;
}

module.exports.sanitizeRepo = function (repo) {
  var safes = ['url', 'public', 'pseudo_terminal', 'display_url',
               '_id', 'active', 'prod_dev_target'];
  var saferepo = {};
  safes.forEach(function(name) {
    saferepo[name] = repo[name];
  });
  saferepo.short_name = saferepo.url.split('/').slice(-2).join('/');
  return saferepo;
}
