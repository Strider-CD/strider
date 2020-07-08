const utils = require('./utils');
const models = require('./models');

const Project = models.Project;
const User = models.User;

module.exports = {
  allProjects: allProjects
};

// Get a sanitized listing of all projects, along with the users who have access
function allProjects(done) {
  User.find({}, function(err, users) {
    if (err) return done(err);

    Project.find()
      .sort({ _id: -1 })
      .exec(function(err, projects) {
        if (err) return done(err);
        done(
          null,
          projects.map(function(project) {
            project = utils.sanitizeProject(project);
            project.created_date = utils.timeFromId(project._id);
            project.users = [];
            for (let i = 0; i < users.length; i++) {
              if ('undefined' !== typeof users[i].projects[project.name]) {
                project.users.push({
                  email: users[i].email,
                  access: users[i].projects[project.name]
                });
              }
            }
            return project;
          })
        );
      });
  });
}
