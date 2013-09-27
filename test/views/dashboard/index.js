
function choice(items) {
  return items[parseInt(Math.random() * items.length)]
}

function id() {
  var hex = 'abcdef1234567890'
    , ret = ''
  for (var i=0; i<16; i++) {
    ret += choice(hex)
  }
  return ret
}

function status(running) {
  var states = ['passed', 'failed', 'errored']
  if (running) states = states.concat(['running', 'submitted'])
  return choice(states)
}

function prev() {
  var num = parseInt(Math.random() * 5)
    , jobs = []
  for (var i=0; i<num; i++) {
    jobs.push({
      _id: id(),
      status: status()
    })
  }
  return jobs
}

function project() {
  return {
    _id: id(),
    prev: prev(),
    name: 'one/two',
    branches: {},
    public: Math.random() > .5,
    display_url: 'http://example.com',
    provider: {
      id: choice(['github', 'bitbucket', 'gitlab'])
    }
  }
}

function githubTrigger() {
  return {
    type: 'commit',
    author: {
      id: id(),
      url: 'http://google.com',
      name: 'Strider Admin',
      email: 'admin@example.com',
      image: '/images/logo-100x100.png',
      username: 'strider'
    },
    message: 'Making it awesome',
    timestamp: new Date() + '',
    url: 'http://example.com/hello',
    source: {
      type: 'plugin',
      plugin: 'github'
    }
  }
}

function manualTrigger() {
  return {
    type: 'manual',
    author: {id: id()},
    message: 'Retest',
    timestamp: new Date() + '',
    url: 'http://example.com',
    source: {
      type: 'UI',
      page: 'dashboard'
    }
  }
}

function trigger() {
  if (Math.random() > .5) return githubTrigger()
  return manualTrigger()
}

function job() {
  return {
    _id: id(),
    trigger: trigger(),
    project: project(),
    status: status(true),
    type: 'TEST_ONLY',
    finished: new Date(new Date().getTime() - 1000 * 60 * 60 * 24 * 20 * Math.random()),
    duration: Math.random() * 30000 + 5000
  }
}

function jobs() {
  var num = parseInt(Math.random() * 10 + 5)
    , jobs = []
  for (var i=0; i<num; i++) {
    jobs.push(job())
  }
  return jobs
}

module.exports = function (testname, params, req, done) {
  if (testname === 'none') return done(null, {jobs: {}, currentUser: true, user: true})
  done(null, {
    currentUser: 'hello@gmail.com',
    user: true,
    jobs: {
      yours: testname !== 'public' ? jobs() : [],
      public: jobs()
    }
  })
}
