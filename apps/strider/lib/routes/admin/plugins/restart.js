module.exports = require('../../../cli/lib/resilient')({
  /**
   * Path to file to touch to restart strider
   */
  restartFile: function () {
    const path = require('path');
    const dir = path.join(__dirname, '..', '..', '..', '..');

    return path.join(dir, '.restart');
  },
}).restart;
