var _ = require('underscore')
  , io = require('socket.io')
  , everypaas = require('everypaas')
  , github = require('./github')
  , http = require('http')
  , logging = require('./logging')
  , parseCookie = require('cookie').parse
  , config = require('./config')
  , express = require('express')
  , expressParser = express.cookieParser(config.session_secret)
  , User = require('./models').User;

var user_websocket_map = exports.user_websocket_map = {};

/*
 * websockets.user_msg()
 *
 * For a given user, look up their connected web sockets and if found emit from
 * all of those.
 */
user_msg = exports.user_msg = function(user_id, msg, data)
{

  var sockets = user_websocket_map[user_id];

  if (sockets !== undefined && sockets.length > 0) {
    _.each(sockets, function(socket) {
      socket.emit(msg, data);
    });
  }

}

/*
 * add_socket()
 *
 * Adds a socket to the per-user list
 */
function add_socket(user_id, socket)
{

  var sockets = user_websocket_map[user_id];

  if (sockets === undefined) {
    user_websocket_map[user_id] = [socket];
  } else {
    sockets.push(socket);
  }
}

/*
 * remove_socket()
 *
 * Removes a socket to the per-user list
 */
function remove_socket(user_id, socket)
{

  var sockets = user_websocket_map[user_id];

  if (sockets !== undefined) {
    var msocket = _.find(sockets, function(s) {
      return s === socket;
    });
    if (msocket !== undefined) {
      sockets = _.without(sockets, msocket);
    }
  }
}

/*
 * websockets.init()
 *
 * Initialize the Socket.io server.
 */
exports.init = function(app, server, session_store){
  var sio = io.listen(server);
  sio.enable('browser client minification');  // send minified client
  sio.enable('browser client etag');          // apply etag caching logic based on version number
  sio.enable('browser client gzip');  
  if (everypaas.isHeroku()) {
    sio.set("transports", ["xhr-polling"]);
    sio.set("polling duration", 10);
  }
  sio.set('log level', 1);

  sio.set('authorization', function(data, accept) {
    if (data.headers.cookie) {
      data.cookie = expressParser(data, {}, function(){
        data.sessionID = data.signedCookies['connect.sid'];
        session_store.get(data.sessionID, function(err, session) {
          if (err || !session) {
              accept('error', false);
          } else {
              data.session = session;
              accept(null, true);
          }
        });
      });
    } else {
        return accept('not authorized', false);
    }
  });

  sio.sockets.on('connection', function(socket) {
    var session = socket.handshake.session;
    if (session.passport === undefined) {
      console.debug("Websocket connection does not have authorization - nothing to do.");
    } else {
      add_socket(session.passport.user, socket);
      socket.on('setuprepo', function(data) {
        User.findOne({'_id': session.passport.user}, function (err, foundUser) {
          var kickoff_repo = foundUser.get_repo_metadata(data.repo_id);
          github.setup_integration(foundUser, kickoff_repo.id, foundUser.get('github.accessToken'), function() {
            console.log("sending repodone");
            socket.emit("repodone", {});
          }, socket, data.no_ssh);
        });

      });
    }
  });
}
