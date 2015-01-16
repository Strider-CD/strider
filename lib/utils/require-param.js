'use strict';


/*
 * Require a request parameter is present or return a 400 response.
 */
function requireParam(key, req, res) {
  var val = req.params[key];

  if (val === undefined) {
    return res.status(400).json({
      status: 'error',
      errors: ['you must supply parameter ' + key]
    });
  }

  return val;
}

module.exports = requireParam;
