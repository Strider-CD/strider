var everypaas = require('everypaas')

var defaults = {

    port: process.env.PORT || 3000
  , server_name : 'http://localhost'
  
  , db_uri :  everypaas.getMongodbUrl() || "mongodb://localhost/strider-foss"
  
  , smtp_host : ''
  , smtp_port : 587
  , smtp_user : ''
  , smtp_pass : ''
  , smtp_from : "Strider <noreply@stridercd.com>"
  
  , enablePty : false
  , extpath : 'node_modules'
  , session_secret : "8L8BudMkqBUqrz"
  
  , github_app_id : ''
  , github_secret : ''

}

if (process.env.APP_ID) {
  console.log("WARNING: You are using APP_ID to configure Github OAuth application id.")
  console.log("This name has been deprecated. Please use GITHUB_APP_ID instead.\n")
  process.env.GITHUB_APP_ID = process.env.APP_ID
}
if (process.env.APP_SECRET) {
  console.log("WARNING: You are using APP_SECRET to configure Github OAuth application secret.")
  console.log("This name has been deprecated. Please use GITHUB_SECRET instead.\n")
  process.env.GITHUB_SECRET = process.env.APP_SECRET
}

defaults.server_name = defaults.server_name + ":" + defaults.port

// Filter process.env.FOO to process.env.strider_foo for rc's benefit
function filterEnv(env) {
  var res = {}
  for (var k in env) {
    if (defaults[k.toLowerCase()] !== undefined)  {
      res["strider_" + k.toLowerCase()] = env[k]
    } else {
      res[k] = env[k]
    }
  }
  return res
}
process.env = filterEnv(process.env)

var rc = require('rc')('strider', defaults)


// TODO rename
rc.server_port = rc.port
rc.strider_server_name = rc.server_name

module.exports = rc
module.exports.viewpath =  __dirname + '/../views'

if (rc.smtp_host) {
module.exports.smtp = {
      host: rc.smtp_host
    , port: rc.smtp_port
    , auth: {
        user: rc.smtp_user
      , pass: rc.smtp_pass
    }
    , from: rc.smtp_from
  }
}

module.exports.plugins = {
  github : {
      appId : rc.github_app_id
    , appSecret : rc.github_secret
    , myHostname : rc.server_name 
  }
}

// Logging configuration
module.exports.logging = {
  exitOnError: true,
  loggly_enabled: false,
  file_enabled: false,
  console: {
    // Log everything
    level: 0,
    colorize: true,
    timestamp: true
  },
  console_enabled: true
}


