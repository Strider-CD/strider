const spawn = require('cross-spawn');
module.exports = function (cwd) {
    return {
        install: function (cb) {
            const proc = spawn('npm', ['install', '--production', '--ignore-scripts'], {
                stdio: 'inherit',
                cwd: cwd,
            });
            proc.on('error', function (err) {
                return cb(err);
            });
            proc.on('close', function (code) {
                if (code !== 0) {
                    return cb(new Error('npm install failed with non-zero status ' + code));
                }
                else {
                    return cb(null);
                }
            });
        },
    };
};
//# sourceMappingURL=npm.js.map