'use strict';
module.exports = function (deps) {
    const resilient = require('./resilient')(deps);
    return function (extpath, opts) {
        const path = require('path');
        const extdir = deps.getPluginPath()(extpath);
        // Save extension dir
        deps.common().extdir = extdir;
        resilient.spawn(function () {
            deps.main()(extdir);
        }, opts.cluster === false);
    };
};
//# sourceMappingURL=start.js.map