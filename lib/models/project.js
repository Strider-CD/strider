
var mongoose = require('mongoose')
  , Schema = mongoose.Schema

var PluginConfig = new Schema({
    id : String
  , config : {}
  , enabled : Boolean
})

var BranchConfig = new Schema({
    active: {type: Boolean, default: true}
  , public: {type: Boolean, default: false}
  , deploy_on_green: {type: Boolean, default: true}
  // ssh keypair
  , pubkey: String
  , privkey: String
  // job & runner plugins
  , plugins : [PluginConfig]
  , plugin_data: {}
  , runner: {
      id: String
    , config: {}
    }
})

var ProjectSchema = new Schema({
    name: {type: String, unique: true, index: true}
  , secret: {type: String}
  , display_url: String
  // looks like:
  // { master: BranchConfig, otherbranch: 'master' || BranchConfig, ... }
  // if a branch maps to 'master', it has all of the same configuration, but 'deploy_on_green' is false
  , branches: {}
  , provider: {
      id: String
    , config: {
    // , url: String
    }
  }
});

var Project = mongoose.model('Project', ProjectSchema);

