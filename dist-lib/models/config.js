const mongoose = require('../utils/mongoose-shim');
const Schema = mongoose.Schema;
const Config = new Schema({
    version: Number,
});
module.exports = mongoose.model('Config', Config);
module.exports.SCHEMA_VERSION = 2;
//# sourceMappingURL=config.js.map