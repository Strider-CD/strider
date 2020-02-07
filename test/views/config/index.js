
var fs = require('fs'),
  path = require('path');

module.exports = function (testname, params, req, done) {
  var txt = fs.readFileSync(path.join(__dirname, 'basic.json'), 'utf8'),
    data;
  try {
    data = JSON.parse(txt);
  } catch (e) {
    return done(e);
  }
  done(null, data);
};
