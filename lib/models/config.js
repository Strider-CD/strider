
var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var Config = new Schema({
  version: Number,
  serverName: String,
  proxyUrl: String,

  smtp: {
    host: String,
    port: Number,
    user: String,
    password: String,
    fromAddress: String
  }
})

module.exports = mongoose.model('Config', Config)

module.exports.SCHEMA_VERSION = 2
