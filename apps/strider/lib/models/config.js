const mongoose = require('../utils/mongoose-shim');
const Schema = mongoose.Schema;

const Config = new Schema({
  version: Number,
  // is there any other configuration we want?
});

module.exports = mongoose.model('Config', Config);

module.exports.SCHEMA_VERSION = 2;
