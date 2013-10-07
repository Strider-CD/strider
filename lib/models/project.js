
var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var PluginConfig = new Schema({
    id : String
  , config : {}
  , enabled : Boolean
})

var BranchConfig = new Schema({
    active: {type: Boolean, default: true}
  , name: {type: String}
  , mirror_master: {type: Boolean, default: true}
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
  // .strider.json file.
  , prefetch_config: {type: Boolean, default: true}
  // used for user-level provider & plugin config.
  , creator: { type: Schema.ObjectId, ref: 'user', index: true }
  // looks like:
  // { master: BranchConfig, otherbranch: 'master' || BranchConfig, ... }
  // if a branch maps to 'master', it has all of the same configuration, but 'deploy_on_green' is false
  , branches: [BranchConfig]
  , provider: {
      id: String      // plugin id of the provider
    , account: String // account id
    , repo_id: String // id of the repository
    , config: {       // decided by the provider
    // , url: String
    }
  }
})

ProjectSchema.method('branch', function (name) {
  for (var i=0; i<this.branches.length; i++) {
    if (this.branches[i].name === name) return this.branches[i]
  }
})

ProjectSchema.static('forUser', function (user, done) {
  if (!user.projects) return done(null, [])
  var names = user.projects.map(function(p) {
    return p.name.toLowerCase()
  })
  if (!names.length) return done(null, [])
  this.find({name: {$in: names}}, done)
})

module.exports = mongoose.model('Project', ProjectSchema);

