const fs = require('fs');
const path = require('path');
const config = require('../config');
const extpaths = config.extpath.split(':');

module.exports = function(extpath) {
  const extdir = [];

  for (const i in extpaths) {
    // Extensions are either in ../node_modules (if local)
    // or __dirname/../
    extdir.push(path.resolve(__dirname, '..', extpaths[i]));

    try {
      fs.statSync(extdir);
    } catch (e) {
      extdir.pop();
      extdir.push(path.resolve(__dirname, '..', extpaths[i]));
    }
  }

  if (extpath) {
    extdir.push(path.resolve(extpath));
  }
  return extdir;
};
