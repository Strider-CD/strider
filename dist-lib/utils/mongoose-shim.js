const Promise = require('bluebird');
const mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.set('useCreateIndex', true);
module.exports = mongoose;
//# sourceMappingURL=mongoose-shim.js.map