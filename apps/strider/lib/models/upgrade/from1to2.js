const models = require('../');
const Project = models.Project;

module.exports = function (done) {
  const newBranch = {
    name: '*',
    mirror_master: true,
  };

  const update = { $push: { branches: newBranch } };
  const options = { multi: true };

  Project.updateMany({}, update, options, done);
};
