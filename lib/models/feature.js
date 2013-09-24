
var mongoose = require('mongoose')
  , Schema = mongoose.Schema

// Features default to being on! See feature.js
var FeatureSchema = new Schema({
    name: { type: String, unique: true }
  // If true, feature enabled for all admin users
  , admin_enabled: { type: Boolean, default: false }
  // List of ObjectID's for users of which feature is enabled
  // if we have a lot of feature documents, we should index this.
  , users_enabled: [{type: Schema.ObjectId, ref: 'user', default: []}]
})

module.exports = mongoose.model('Feature', FeatureSchema)
