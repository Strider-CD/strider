var everypaas = require('everypaas')

var rc = require('rc')('strider', {
  port: process.env.PORT || 3000
, server_name : 'localhost'

, db_uri :  everypaas.getMongodbUrl() || "mongodb://localhost/strider-foss"

, smtp_host : ''
, smtp_port : 587
, smtp_user : ''
, smtp_pass : ''
, smtp_from : "Strider <noreply@stridercd.com>"

, enablePty : false
, extpath : 'node_modules'
, session_secret : "8L8BudMkqBUqrz"

, github_app_id : undefined
, github_secret : undefined
})

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

