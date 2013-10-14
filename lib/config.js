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

// Filter process.env for rc
process.env = filterEnv(process.env)

var rc = require('rc')('strider', defaults)

// alias process.env.FOO to process.env.STRIDER_FOO for rc's benefit
function filterEnv(env) {
  var res = {}
  for (k in env) {
    if (defaults[k.toLowerCase()] !== undefined)  {
      res["strider_" + k.toLowerCase()] = env[k]
    } else {
      res[k] = env[k]
    }
  }


  return res
}

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


