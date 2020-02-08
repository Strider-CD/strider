
function genId() {
  var id = '',
    chars = 'abcdef1234567890';
  for (var i=0; i<32; i++) {
    id += chars[parseInt(Math.random() * chars.length)];
  }
  return id;
}

function trigger(params) {
  var type = params.trigger || 'commit',
    author = {
      id: genId(),
      url: 'http://google.com',
      name: 'Strider Admin',
      email: 'admin@example.com',
      image: '/images/logo-100x100.png',
      username: 'strider'
    };
  return {
    type: type,
    author: author,
    message: 'Making it awesome',
    timestamp: `${new Date()  }`,
    url: 'http://example.com/hello',
    source: {
      type: 'plugin',
      plugin: 'github'
    }
  };
}

var CMDS = 'nvm mocha npm mongod pip py.test make cat echo'.split(' '),
  ARGS = 'test help run blastoff doit reapply install'.split(' '),
  LINES = [
    'Hello World',
    '.......',
    '---------------->',
    'waiting...',
    'Systems running at max capacity',
    'Nothing to do',
    'Looks good',
    'Life is wonderful'
  ];

function pick(items) {
  return items[parseInt(Math.random() * items.length)];
}

function command() {
  var cmd = pick(CMDS),
    output = [],
    nargs = parseInt(Math.random() * 3),
    nlines = parseInt(Math.random() * 5) + 2;
  for (var i=0; i<nargs; i++) {
    cmd += ` ${  pick(ARGS)}`;
  }
  for (var i=0; i<nlines; i++) {
    output.push(pick(LINES));
  }
  return {
    started: `${new Date()  }`,
    duration: parseInt(Math.random() * 2000),
    command: cmd,
    plugin: pick(['node', 'python', 'github', 'sauce', 'mongo']),
    out: output.join('\n'),
    err: '',
    merged: output.join('\n')
  };
}

function phase(params, finished) {
  var commands = [],
    num = 1 + Math.random() * 3;
  for (var i=0; i<num; i++) {
    commands.push(command());
  }
  return {
    finished: `${finished  }`,
    duration: parseInt(Math.random() * 2000),
    exitCode: 0,
    commands: commands
  };
}

function pluginData(params) {
  return {};
}

function core(params) {
  var now = new Date().getTime(),
    deploy = Math.random() > .5,
    job = {
      type: deploy ? 'TEST_AND_DEPLOY' : 'TEST_ONLY',
      id: genId(),
      status: pick(['succeeded', 'failed', 'submitted', 'running', 'succeeded', 'succeeded', 'succeeded']),
      user_id: genId(),
      project: `${params.org  }/${  params.repo}`,
      ref: {
        branch: params.branch || 'master',
        id: genId()
      },
      trigger: trigger(params),
      phases: {
        environment: phase(params, new Date(now + 5000)),
        prepare: phase(params, new Date(now + 6000)),
        test: phase(params, new Date(now + 7000)),
        deploy: deploy ? phase(params, new Date(now + 8000)) : null,
        cleanup: phase(params, new Date(now + 10000))
      },
      plugin_data: pluginData(params),
      std: {
        out: 'ignoring',
        err: '',
        merged: 'ignoring'
      },
      created: `${new Date(now)  }`,
      queued: `${new Date(now + 2000)  }`,
      started: `${new Date(now + 4000)  }`,
      finished: `${new Date(now + 10000)  }`,
      duration: 6,
      archived: null,
      test_exitcode: 0,
      deplot_exitcode: deploy ? 0 : null,
      errored: false
    };
  job.phases.prepare.collapsed = true;
  job.phases.environment.collapsed = true;
  job.phases.cleanup.collapsed = true;
  return job;
}

function makeJob(name, params) {
  var data = require('./basic.json');
  data.project.name = name;
}

function sanitizeProject(project) {
  delete project.provider.config;
  Object.keys(project.branches).forEach(function (branch) {
    for (var i=0; i<project.branches[branch].plugins.length; i++) {
      delete project.branches[branch].plugins[i].config;
    }
  });
}

module.exports = function (testname, params, req, done) {
  if (require.cache['./basic.json']) delete require.cache['./basic.json'];
  var data = require('./basic.json'),
    name = `${params.org  }/${  params.repo}`;
  data.project.name = name;
  data.jobs = [];
  if (testname === 'anon') data.project = sanitizeProject(data.project);
  for (var i=0; i<10; i++) {
    data.jobs.push(core(params));
  }
  done(null, data);
};
  
