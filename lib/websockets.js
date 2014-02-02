var _ = require('underscore')
  , io = require('socket.io')
  , everypaas = require('everypaas')
  , http = require('http')
  , gravatar = require('gravatar')
  , logging = require('./logging')
  , parseCookie = require('cookie').parse
  , config = require('./config')
  , express = require('express')
  , expressParser = express.cookieParser(config.session_secret)
  , models = require('./models')
  , Project = models.Project
  , User = models.User
  , Job = models.Job

  , common = require('./common')
  , jobs = require('./jobs')
  , utils = require('./utils')

var user_websocket_map = {}

module.exports = UserSockets

function authorize(sessionStore, data, accept) {
  if (data.headers.cookie) {
    data.cookie = expressParser(data, {}, function(){
      data.sessionID = data.signedCookies['connect.sid'];
      sessionStore.get(data.sessionID, function(err, session) {
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
}

/*
 * websockets.init()
 *
 * Initialize the Socket.io server.
 */
// sio: socketio server. ex: io.listen(server)
function UserSockets(sio, sessionStore) {
  this.sio = sio
  this.sockets = {}
  this.sessionStore = sessionStore
  sio.enable('browser client minification');  // send minified client
  sio.enable('browser client etag');          // apply etag caching logic based on version number
  sio.enable('browser client gzip');
  if (everypaas.isHeroku()) {
    sio.set("transports", ["xhr-polling"]);
    sio.set("polling duration", 10);
  }
  sio.set('log level', 1);
  sio.set('authorization', authorize.bind(this, sessionStore))
  sio.sockets.on('connection', this.connected.bind(this))
}

UserSockets.prototype =  {
  addSocket: function (uid, socket) {
    if (!this.sockets[uid]) {
      this.sockets[uid] = new UserSocket(uid)
    }
    this.sockets[uid].add(socket)
  },
  // -> true if the socket was found and removed. false if it wasn't found
  removeSocket: function (uid, socket) {
    var socks = this.sockets[uid]
      , idx
    if (!socks) return false
    return socks.remove(socket)
  },
  // socket callback. Adds a new socket
  connected: function (socket) {
    var session = socket.handshake.session;
    if (session.passport === undefined) {
      console.debug("Websocket connection does not have authorization - nothing to do.");
    } else {
      this.addSocket(session.passport.user, socket);
    }
  },
  // send a message to a number of users
  // send([uid, uid, ...], arguments)
  send: function (users, args) {
    var sock
    for (var i=0; i<users.length; i++) {
      if (!this.sockets[users[i]]) continue;
      this.sockets[users[i]].emit(args)
    }
  },
  // send a public message - to all /but/ the specified users
  sendPublic: function (users, args) {
    var sock
    for (var id in this.sockets) {
      if (users.indexOf(id) !== -1) continue;
      this.sockets[id].emit(args)
    }
  }
}

function kickoffJob(user, project, type, branch) {
  var now = new Date()
    , trigger
    , job
  branch = branch || 'master'
  trigger = {
    type: 'manual',
    author: {
      id: user._id,
      email: user.email,
      image: gravatar.url(user.email, {}, true)
    },
    message: type === 'TEST_AND_DEPLOY' ? 'Redeploying' : 'Retesting',
    timestamp: now,
    source: {type: 'UI', page: 'unknown'}
  }
  if (branch !== 'master') {
    trigger.message += ' ' + branch
  }
  job = {
    type: type,
    user_id: user._id,
    project: project,
    ref: {branch: branch},
    trigger: trigger,
    created: now
  }
  common.emitter.emit('job.prepare', job)
}

function UserSocket(userid) {
  this.userid = userid
  this.sockets = []
}

function waiter(socket, event) {
  var wait = {
    event: event,
    calls: [],
    handler: function () {
      wait.calls.push(arguments)
    }
  }
  return wait
}

function unWait(socket, waiter, handler) {
  socket.removeListener(waiter.event, waiter.handler)
  socket.on(waiter.event, handler)
  for (var i=0; i<waiter.calls.length; i++) {
    handler.apply(null, waiter.calls[i])
  }
}

UserSocket.prototype = {
  add: function (socket) {
    var waiters = {}
      , self = this
    for (var name in this.events) {
      socket.on(name, (waiters[name] = waiter(socket, name)).handler)
    }
    this.getUser(function () {
      for (var name in self.events) {
        unWait(socket, waiters[name], self.events[name].bind(self))
      }
    })
    this.sockets.push(socket)
  },
  remove: function (socket) {
    var idx = this.sockets.indexOf(socket)
    if (idx === -1) return false
    this.sockets.splice(idx, 1)
    return true
  },
  // args are passed to an `apply` call on each socket
  emit: function (args) {
    for (var i=0; i<this.sockets.length; i++) {
      this.sockets[i].emit.apply(this.sockets[i], args)
    }
  },
  on: function () {
    for (var i=0; i<this.sockets.length; i++) {
      this.sockets[i].on.apply(this.sockets[i], arguments)
    }
  },
  getUser: function (done) {
    if (!this.userid) return done()
    var self = this
    User.findById(this.userid, function (err, user) {
      if (err) console.error('failed to get user - socket', err)
      if (!user) {
        console.error("user not found for the websocket - there's something strange going on w/ websocket auth. User Id: ", self.userid)
        self.emit(['auth.failed'])
        return
      }
      self.user = user
      done()
    })
  },
  events: {
    'dashboard:jobs': function (done) {
      var self = this
      jobs.latestJobs(this.user, function (err, jobs) {
        done(jobs)
      })
    },
    'dashboard:unknown': function (id, done) {
      var self = this
      Job.findById(id).lean().exec(function (err, job) {
        if (err || !job) return console.error('[unknownjob] error getting job', id, err)
        Project.findOne({name: job.project.toLowerCase()}).lean().exec(function (err, project) {
          if (err || !project) return console.error('[unknownjob] error getting project', id, err)
          var njob = jobs.small(job)
          njob.project = utils.sanitizeProject(project)
          // this will be filled in
          njob.project.prev = []
          done(njob)
        })
      })
    },
    'build:job': function (id, done) {
      Job.findById(id).lean().exec(function (err, job) {
        if (err) return console.error('Error retrieving job', id, err.message, err.stack)
        if (!job) return console.error('Job not found', id)
        job.status = jobs.status(job)
        done(job)
      })
    },
    'build:unknown': function (id, done) {
      // TODO: query the responsible runner to get the current output, etc.
    },
    'test': function (project, branch) {
      kickoffJob(this.user, project, 'TEST_ONLY', branch)
    },
    'deploy': function (project, branch) {
      kickoffJob(this.user, project, 'TEST_AND_DEPLOY', branch)
    },
    'cancel': function (id) {
      console.log('Got a request to cancel', id)
      common.emitter.emit('job.cancel', id)
    }
  }
}

module.exports.init = function(server, session_store){
  return common.ws = new UserSockets(io.listen(server), session_store)
}
