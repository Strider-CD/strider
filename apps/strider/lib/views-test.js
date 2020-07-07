// This file allows us to test views with mocked view data.
// To test a view, add an entry to the `paths` variable.
// The `fixture` string will be require()d relative to
// `STRIDER_BASE/test/views/`
//
// The test fixture will be triggered when the appointed path is
// requested with the querystring `?test`.

const path = require('path');
const pathRegexp = require('path-to-regexp');

function matcher(path) {
  const params = [];
  const rx = pathRegexp(path, params);

  return function(pathname) {
    const match = rx.exec(pathname);
    const data = {};
    if (!match) return false;
    for (let i = 0; i < params.length; i++) {
      data[params[i].name] = match[i + 1];
    }
    return data;
  };
}

const paths = [
  {
    path: matcher('/:org/:repo/'),
    template: 'build.html',
    fixture: 'project'
  },
  {
    path: matcher('/:org/:repo/job/:id'),
    template: 'build.html',
    fixture: 'project'
  },
  {
    path: matcher('/:org/:repo/config'),
    template: 'project_config.html',
    fixture: 'config'
  },
  {
    path: matcher('/'),
    template: 'index.html',
    fixture: 'dashboard'
  },
  {
    path: matcher('/projects'),
    template: 'projects.html',
    fixture: 'projects'
  }
];

// spoof an api call
function api(req, res, next) {
  // TODO parse the path and things
  console.log('Referrer! And things', req._parsedUrl.pathname);
  next();
}

function handle(req, res, next) {
  const test = req.query.test;
  const pathname = req._parsedUrl.pathname;
  const referrer = req.get('referrer');

  if ('undefined' === typeof test) {
    if (
      referrer &&
      referrer.indexOf('?test') !== -1 &&
      req.accepts('text, json') === 'json'
    ) {
      return api(req, res, next);
    }
    return next();
  }

  let config;
  for (let i = 0; i < paths.length; i++) {
    var params = paths[i].path(pathname);
    if (params) {
      config = paths[i];
      break;
    }
  }
  if (!config) {
    console.warn(
      `Looks like you're trying to test a route, but there's no config for '${req._parsedUrl.pathname}'.`
    );
    return next();
  }

  const filename = path.join(__dirname, `../test/views/${config.fixture}`);
  if (require.cache[filename]) delete require.cache[filename];
  let data;
  try {
    data = require(filename);
  } catch (e) {
    return res.send(`Failed to load fixture: ${e.message}`, e.stack);
  }
  function send(data) {
    res.render(config.template, data);
  }

  if ('function' === typeof data) {
    return data(test, params, req, function(err, data) {
      if (err) return res.send(`Failed to load data: ${err.message}`);
      send(data);
    });
  }
  send(data);
}

module.exports = function(app) {
  app.use(handle);
};
