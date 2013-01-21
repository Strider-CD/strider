//------------------------------------
// Default (development) config values
//------------------------------------

// MongoDB connection URI for the app
exports.db_uri = "mongodb://localhost/stridercdtest";

// Session store secret
exports.session_secret = "ZZZ";

// Server port
exports.server_port = 3000;

// Github OAuth2 API config
exports.github = {
    appId: "a3af4568e9d8ca4165fe",
    appSecret: "18651128b57787a3336094e2ba1af240dfe44f6c",
    myHostname: "http://localhost:" + exports.server_port
};

// Server URL on the Internet
exports.strider_server_name = "http://localhost:3000";

// Email settings
exports.sendgrid = {
    username: "foo"
  , password: "bar"
};

/// ---------------------------------------
//  Strider test run environment overrides
//  ---------------------------------------
if (process.env.MONGODB_URI !== undefined) {
  exports.db_uri = process.env.MONGODB_URI;
}
