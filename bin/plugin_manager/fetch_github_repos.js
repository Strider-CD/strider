var li = require('li')
var Promise = require('bluebird')
var request = require('request')

function get(url, cb) {
  console.log("Performing GET "+url)
  request({
    method: 'GET',
    uri: url,
    headers: {
      'user-agent': 'strider',
      'content-type': 'application/json'
    }
  }, cb)
}

module.exports = function fetchRepos(url) {
  var repos = []
  var cb = null;

  return new Promise(function(resolve, reject){
    cb = function (err, res, body) {
      if (err) reject(err);
      console.log("Rate limit remaining: "+res.headers['x-ratelimit-remaining'])
      var newRepos = JSON.parse(body)
      console.log("Found "+newRepos.length+" repos")
      repos = repos.concat(newRepos)
      var next = res.headers.link ? li.parse(res.headers.link).next : null;
      if (next) {
        get(next, cb);
      } else {
        resolve(repos);
      }
    }
    get(url, cb);
  })
}
