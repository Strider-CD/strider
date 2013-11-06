module.exports = cors;

function cors(domains) {

  if (Array.isArray(domains)) {
    domains = domains.join(',');
  }

  return CORS;

  function CORS(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', domains);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Cookie');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    if (req.method == 'OPTIONS') {
      res.end();
    } else next();
  }
}