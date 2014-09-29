var Promise = require('bluebird')
var request = require('request')
var _ = require('lodash')
var yaml = require('js-yaml')

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
      var data = yaml.load(body);
      resolve(_.map(data, function(version, name) {
        return {
          name: name,
          version: version
        }
      }));
    }
    get(url, cb);
  })
}
