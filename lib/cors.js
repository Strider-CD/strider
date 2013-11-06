module.exports = cors;

function cors(config) {

  var allowedDomains = config.cors_allowed_domains;
  if (Array.isArray(allowedDomains)) {
    allowedDomains = allowedDomains.join(',');
  }

  return CORS;

  function CORS(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', allowedDomains);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Cookie');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method == 'OPTIONS') {
      res.end();
    } else next();
  }
}