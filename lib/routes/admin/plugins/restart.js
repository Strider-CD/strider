module.exports = require('strider-cli/resilient')({
  /* 
   * Path to file to touch to restart strider
   */
  restartFile: function() {
    var path = require('path')
    var dir = path.join(__dirname, '..', '..', '..', '..');
    return path.join(dir, '.restart')
  }
}).restart
