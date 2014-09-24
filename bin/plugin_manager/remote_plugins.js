var Promise = require('bluebird')
var request = require('request')

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
      resolve(body.split('\n'));
    }
    get(url, cb);
  })
}
