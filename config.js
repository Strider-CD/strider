//------------------------------------
// Default (development) config values
//------------------------------------

// MongoDB connection URI for the app
exports.db_uri = "mongodb://localhost/strider-foss";

// Session store secret
exports.session_secret = "8L8BudMkqBUqrz";

// Server port
exports.server_port = 3000;

// Server URL on the Internet
var sm = exports.strider_server_name = "http://localhost:3000";

// Github OAuth2 API config
// Register your own at: https://github.com/settings/applications/new
exports.github = {
    appId: "a3af4568e9d8ca4165fe",
    appSecret: "18651128b57787a3336094e2ba1af240dfe44f6c",
    // Re-use strider_server_name
    myHostname: sm
};


// ZeroMQ bind address
exports.zeromq_addr = "tcp://0.0.0.0:31012";

// Email settings
exports.smtp = {
    host: "smtp.foo.com",
    port: 587,
    username: "foobar",
    password: "setme"
};

// Logging configuration
exports.logging = {
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

