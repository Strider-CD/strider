module.exports = require('strider-cli/lib/resilient')({
    /**
     * Path to file to touch to restart strider
     */
    restartFile: function () {
        var path = require('path');
        var dir = path.join(__dirname, '..', '..', '..', '..');
        return path.join(dir, '.restart');
    }
}).restart;
//# sourceMappingURL=restart.js.map