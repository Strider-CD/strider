// Defaults:
var PORT = process.env.PORT || 3000
  , SESSION_SECRET = process.env.SESSION_SECRET || "8L8BudMkqBUqrz"
  , SERVER_NAME = process.env.SERVER_NAME || "http://localhost:3000"
  , GITHUB_APP_ID = process.env.GITHUB_APP_ID || "a3af4568e9d8ca4165fe"
  , GITHUB_APP_SECRET = process.env.GITHUB_APP_SECRET || "18651128b57787a3336094e2ba1af240dfe44f6c"
  , SMTP_HOST = process.env.SMTP_HOST
  , SMTP_PORT = process.env.SMTP_PORT || 587
  , SMTP_USER = process.env.SMTP_USER
  , SMTP_PASS = process.env.SMTP_PASS
  , DISABLE_PTY = provess.env.DISABLE_PTY
  , EXTPATH = process.env.STRIDER_EXTPATH || "node_modules"

var everypaas = require('everypaas')
var smtp
if (SMTP_HOST) {
  smtp = {
      host: SMTP_HOST
    , port: SMTP_PORT
    , auth: {
        user: SMTP_USER
      , pass: SMTP_PASS
    }
  }
}


// Config object encapsulates strider configured state from ENV variables etc.
module.exports = {
    db_uri : process.env.DB_URI || everypaas.getMongodbUrl() || "mongodb://localhost/strider-foss"
  , server_port: PORT
  , session_secret: SESSION_SECRET
  , strider_server_name: SERVER_NAME
  , github : {
      appId : GITHUB_APP_ID
    , appSecret : GITHUB_APP_SECRET
    , myHostname : SERVER_NAME
  }
  , smtp: smtp
  , extpath: EXTPATH
  , disablePty: DISABLE_PTY
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

module.exports.viewpath =  __dirname + '/../views'
