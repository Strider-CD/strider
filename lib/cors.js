var _ = require('underscore');

module.exports = cors;

function cors(options) {

  options = gatherOptions(options);
  console.log('CORS options: %j', options);

  return corsMiddleware;

  function corsMiddleware(req, res,next) {
    res.setHeader('Access-Control-Allow-Origin', options.domains);
    res.setHeader('Access-Control-Allow-Methods', options.methods);
    res.setHeader('Access-Control-Allow-Headers', options.headers);
    if (options.allowCredentials)
      res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method == 'OPTIONS') {
      res.statusCode = 204;
      res.setHeader('Access-Control-Max-Age', options.maxAge);
      res.setHeader('Content-Type', 'text/plain charset=UTF-8');
      res.end();
    } else next();
  }
}

var defaultOptions = {
  domains: '*',
  headers: [
    'DNT',
    'X-Mx-ReqToken',
    'Keep-Alive',
    'User-Agent',
    'X-Requested-With',
    'If-Modified-Since',
    'Cache-Control',
    'Content-Type',
    'Accept',
    'Accept-Encoding',
    'Origin',
    'Referer',
    'Pragma',
    'Cookie'
  ],
  methods: [
    'GET',
    'PUT',
    'POST',
    'DELETE',
    'OPTIONS'
  ],
  maxAge: 1728000,
  allowCredentials: true
};

function gatherOptions(options) {
  if (! options) options = {};

  if (typeof options != 'object') {
    options = { domains: options };
  }

  options = _.extend(_.clone(defaultOptions), options);

  ['domains', 'headers', 'methods'].forEach(function(prop) {
    if (Array.isArray(options[prop]))
      options[prop] = options[prop].join(',');
  });

  return options;
}