var _ = require('underscore')
  , io = require('socket.io')
  , everypaas = require('everypaas')
  , http = require('http')
  , logging = require('./logging')
  , parseCookie = require('cookie').parse
  , config = require('./config')
  , express = require('express')
  , expressParser = express.cookieParser(config.session_secret)
  , models = require('./models')
  , Project = models.Project
  , User = models.User
  , Job = models.Job

  , jobs = require('./jobs')
  , utils = require('./utils')

var user_websocket_map = exports.user_websocket_map = {};

/*
 * websockets.user_msg()
 *
 * For a given user, look up their connected web sockets and if found emit from
 * all of those.
 */
var user_msg = exports.user_msg = function(user_id, msg, data) {
  var sockets = user_websocket_map[user_id];

  if (sockets !== undefined && sockets.length > 0) {
    _.each(sockets, function(socket) {
      socket.emit(msg, data);
    });
  }

}

// Send an event up to multiple users
// send([id, id, ...], "eventname", data)
var send = exports.send = function (users) {
  var args = [].slice.call(arguments, 1)
    , sock
  for (var i=0; i<users.length; i++) {
    if (!user_websocket_map[users[i]]) continue;
    for (var j=0; j<user_websocket_map[users[i]].length; j++) {
      sock = user_websocket_map[users[i]][j]
      sock.emit.apply(sock, args)
    }
  }
}

// Send a public event to users /not/ in the the list -- all those who
// don't have private access.
// users: [id, id, ...]
var sendPublic = exports.sendPublic = function (users) {
  var args = [].slice.call(arguments, 1)
    , sock
  Object.keys(user_websocket_map).forEach(function (id) {
    if (users.indexOf(id) !== -1) return
    for (var j=0; j<user_websocket_map[id].length; j++) {
      sock = user_websocket_map[id][j]
      sock.emit.apply(sock, args)
    }
  })
}

/*
 * add_socket()
 *
 * Adds a socket to the per-user list
 */
function add_socket(user_id, socket) {

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
function remove_socket(user_id, socket) {

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

function UserSocket(userid, socket) {
  this.userid = userid
  this.socket = socket
  this.waiters = {}
  this.getUser()
  this.listen()
}

UserSocket.prototype = {
  emit: function () {
    this.socket.emit.apply(this.socket, arguments)
  },
  on: function () {
    this.socket.on.apply(this.socket, arguments)
  },
  getUser: function () {
    var self = this
    User.findById(this.userid, function (err, user) {
      if (err) console.error('failed to get user - socket', err)
      self.user = user
      self.unWait()
    })
  },
  events: {
    getjobs: function () {
      var self = this
      jobs.latestJobs(this.user, function (err, jobs) {
        self.emit('joblist', jobs)
      })
    },
    unknownjob: function (id) {
      var self = this
      Job.findById(id, function (err, job) {
        if (err || !job) return console.error('[unknownjob] error getting job', id, err)
        Project.find({name: job.project}, function (err, project) {
          if (err || !project) return console.error('[unknownjob] error getting project', id, err)
          var njob = utils.sanitizeJob(job)
          njob.project = utils.sanitizeProject(project)
          // this will be filled in
          njob.project.prev = []
          self.emit('unknownjob:response', njob)
        })
      })
    }
  },
  waiter: function (event) {
    var waiter = this.waiters[event] = {
      calls: [],
      handler: function () {
        waiter.calls.push(arguments)
      }
    }
    return waiter.handler
  },
  unWait: function () {
    for (var event in this.waiters) {
      this.socket.removeListener(event, this.waiters[event].handler)
      this.socket.on(event, this.events[event].bind(this))
      for (var i=0; i<this.waiters[event].calls.length; i++) {
        this.events[event].apply(this, this.waiters[event].calls[i])
      }
    }
  },
  listen: function () {
    for (var name in this.events) {
      this.socket.on(name, this.waiter(name))
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
      // console.log(socket);
      add_socket(session.passport.user, socket);
      new UserSocket(session.passport.user, socket);
      /** TODO update to new api
      socket.on('setuprepo', function(data) {
        User.findOne({'_id': session.passport.user}, function (err, foundUser) {
          var kickoff_repo = foundUser.get_repo_metadata(data.repo_id);
          github.setup_integration(foundUser, kickoff_repo.id, foundUser.get('github.accessToken'), function() {
            console.log("sending repodone");
            socket.emit("repodone", {});
          }, socket, data.no_ssh);
        });

      });
      **/
    }
  });
}
