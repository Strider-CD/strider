//------------------------------------
// Default (development) config values
//------------------------------------

// MongoDB connection URI for the app
exports.db_uri = process.env.MONGODB_URI ||
                 process.env.MONGOHQ_URL ||
                 process.env.MONGOLAB_URL ||
                 "mongodb://localhost/strider-foss";

// Session store secret
exports.session_secret = process.env.SESSION_SECRET || "this_is_a_secret";

// Server port
exports.server_port = process.env.PORT || 3000;

// Server URL on the Internet
var sm = exports.strider_server_name = process.env.SERVER_NAME || "http://localhost:" + exports.server_port;

// Github OAuth2 API config
// Register your own at: https://github.com/settings/applications/new
exports.github = {
    appId: process.env.GITHUB_APP_ID || "a3af4568e9d8ca4165fe",
    appSecret: process.env.GITHUB_APP_SECRET || "18651128b57787a3336094e2ba1af240dfe44f6c",
    // Re-use strider_server_name
    myHostname: sm
};


// ZeroMQ bind address
exports.zeromq_addr = "tcp://0.0.0.0:31012";

// Email settings
exports.sendgrid = {
    username: process.env.SENDGRID_USERNAME || "user"
  , password: process.env.SENDGRID_PASSWORD || "pass"
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
