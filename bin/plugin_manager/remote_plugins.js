var Promise = require('bluebird')
var request = require('request')
var _ = require('lodash')

function get(url, cb) {
  console.log("Performing GET "+url)
  request({
    method: 'GET',
    uri: url
  }, cb)
}

module.exports = {
  fetchIndex: fetchPluginIndex
}

function fetchPluginIndex(url) {
  var items = []
  var cb = null;

  return new Promise(function(resolve, reject){
    cb = function (err, res, body) {
      if (err) reject(err);
      var rows = body.trim().split('\n')
      resolve(_.map(rows, function(row) {
        var parts = row.split(' ')
        return {
          name: parts[0].trim(),
          version: parts[1].trim()
        }
      }));
    }
    get(url, cb);
  })
}
