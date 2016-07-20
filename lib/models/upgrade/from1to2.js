
var models = require('../')
  , Project = models.Project;

module.exports = function (done) {
  var newBranch =
      { name: '*'
      , mirror_master: true
      }
    , update = { $push: { branches: newBranch } }
    , options = { multi: true };

  Project.update({}, update, options, done);
};