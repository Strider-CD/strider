var fs = require('fs')
var path = require('path')
var config = require('./config')
var extpaths = config.extpath.split(':');

module.exports = function (extpath) {
  var extdir = [];

  for (var i in extpaths) {
    // Extensions are either in ../node_modules (if local)
    // or __dirname/../
    extdir.push(path.resolve(__dirname + "../" + extpaths[i]));

    try {
      fs.statSync(extdir);
    } catch(e) {
      extdir.pop();
      extdir.push(path.resolve(__dirname + "/../" + extpaths[i]));
    }
  }

  if (extpath){
    extdir.push(path.resolve(extpath));
  }
  return extdir
}
