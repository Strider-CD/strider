
var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var PluginConfig = new Schema({
    id : String
  , config : {}
  , enabled : Boolean
})

var BranchConfig = new Schema({
    active: {type: Boolean, default: true}
  , deploy_on_green: {type: Boolean, default: true}
  // ssh keypair
  , pubkey: String
  , privkey: String
  // job & runner plugins
  , plugins : [PluginConfig]
  , runner: {
      id: String
    , config: {}
    }
  // for persistance, not configuration
  , plugin_data: {}
})

var ProjectSchema = new Schema({
    name: {type: String, unique: true, index: true} // name is always lower case!
  , display_name: {type: String} // display name can be mixed case, for display
  , public: {type: Boolean, default: false, index: true}
  , secret: {type: String}
  , display_url: String
  // grab the `.strider.json` in advance - could be expensive for some
  // providers (like raw git). This allows runner configuration in the
  // .strider.json file
  , prefetch_config: {type: Boolean, default: true}
  // used for user-level provider & plugin config.
  , creator: { type: Schema.ObjectId, ref: 'user' }
  // looks like:
  // { master: BranchConfig, otherbranch: 'master' || BranchConfig, ... }
  // if a branch maps to 'master', it has all of the same configuration, but 'deploy_on_green' is false
  , branches: {}
  , provider: {
      id: String
    , repo_id: String
    , config: {
    // , url: String
    }
  }
});

ProjectSchema.static('forUser', function (user, done) {
  if (!user.projects) return done(null, [])
  var names = Object.keys(user.projects)
  if (!names.length) return done(null, [])
  this.find({name: {$in: names}}, done)
})

module.exports = mongoose.model('Project', ProjectSchema);

