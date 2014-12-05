'use strict';

var BASE_PATH = '../../../';
var User = require(BASE_PATH + 'models').User;

/*
 * GET /admin/users
 */
exports.get_user_list = function(req,res) {
  var users = [];

  User.find({}).sort({'email': 1}).exec(function(err,results){
    results.forEach(function(user) {
      users.push({ id: user.id, email: user.email });
    });

    var output = JSON.stringify(users, null, '\t');
    res.end(output);
  });
};

/*
 * GET /api/admin/jobs_status
 * Returns JSON object of last 100 jobs across entire system
 */
exports.admin_jobs_status = function(req, res) {
  res.send(500, 'Not yet implemented');
};
