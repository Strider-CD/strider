var io = require('socket.io');
var cookieParser = require('cookie-parser');
var config = require('./config');
var common = require('./common');
var UserSocket = require('./utils/user-socket');
var expressParser = cookieParser(config.session_secret);

/*
 * websockets.init()
 *
 * Initialize the Socket.io server.
 */
// sio: socketio server. ex: io.listen(server)
function UserSockets(sio, sessionStore) {
  this.sio = sio;
  this.sockets = {};
  this.sessionStore = sessionStore;
  //sio.enable('browser client minification');  // send minified client
  //sio.enable('browser client etag');          // apply etag caching logic based on version number
  //sio.enable('browser client gzip');
  //sio.set('log level', 1);
  //sio.set('authorization', authorize.bind(this, sessionStore))
  sio.use(authorize.bind(this, sessionStore));
  sio.sockets.on('connection', this.connected.bind(this));
}

module.exports = UserSockets;

UserSockets.prototype = {
  addSocket: function(uid, socket) {
    if (!this.sockets[uid]) {
      this.sockets[uid] = new UserSocket(uid);
    }
    this.sockets[uid].add(socket);
  },
  // -> true if the socket was found and removed. false if it wasn't found
  removeSocket: function(uid, socket) {
    var socks = this.sockets[uid];
    if (!socks) return false;
    return socks.remove(socket);
  },
  // socket callback. Adds a new socket
  connected: function(socket) {
    var session = socket.handshake.session;

    if (session && session.passport) {
      this.addSocket(session.passport.user, socket);
    } else {
      console.debug(
        'Websocket connection does not have authorization - nothing to do.'
      );
    }
  },
  // send a message to a number of users
  // send([uid, uid, ...], arguments)
  send: function(users, args) {
    for (var i = 0; i < users.length; i++) {
      if (!this.sockets[users[i]]) continue;
      this.sockets[users[i]].emit(args);
    }
  },
  // send a message to a number of users running callback to get args
  // send([uid, uid, ...], callback)
  sendEach: function(users, fn) {
    for (var i = 0; i < users.length; i++) {
      if (!this.sockets[users[i]] || !this.sockets[users[i]].user) continue;
      this.sockets[users[i]].emit(fn(this.sockets[users[i]].user));
    }
  },
  // send a public message - to all /but/ the specified users
  sendPublic: function(users, args) {
    for (var id in this.sockets) {
      if (users.indexOf(id) !== -1) continue;
      this.sockets[id].emit(args);
    }
  }
};

function authorize(sessionStore, data, next) {
  if (data.handshake.headers.cookie) {
    var req = data.handshake;
    expressParser(req, {}, function() {
      var sessionID = req.signedCookies['connect.sid'];
      sessionStore.get(sessionID, function(err, session) {
        if (err || !session) {
          next(new Error('not authorized'));
        } else {
          req.session = session;
          next();
        }
      });
    });
  } else {
    return next(new Error('not authorized'));
  }
}

module.exports.init = function(server, sessionStore) {
  return (common.ws = new UserSockets(io.listen(server), sessionStore));
};
