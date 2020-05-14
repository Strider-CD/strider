const mongoose = require('../utils/mongoose-shim');

mongoose.models = {};

module.exports = {
  InviteCode: require('./invite'),
  Job: require('./job').default,
  User: require('./user').default,
  Project: require('./project'),
  Config: require('./config'),
};
