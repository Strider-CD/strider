var Step = require('step')
  , request = require('request')
  , config = require('./test-config')
  , models = require('../lib/models')
  , mongoose = require('mongoose')
  , mongodbUrl = process.env.STRIDER_TEST_DB || config.db_uri
  , async = require('async')

console.log("Connecting to MongoDB URL: %s", mongodbUrl);

var TEST_USERS = [
  {email: "test1@example.com", password: "open-sesame", jar: request.jar()}
, {email: "test2@example.com", password: "test", jar: request.jar()}
, {email: "test3@example.com", password: "password", jar: request.jar()}
];


var importUsers = function(cb){
  console.log("dropping existing users table")
  models.User.remove({}, function(err){
    if (err) throw err;

    console.log("dropped")

    async.eachSeries(TEST_USERS, function(u, done){
      var user = new models.User();
      user.email = u.email
      user.set('password', u.password)

      return user.save(done);
    }, function(err){
      cb(err, null)
    })
  })

}

var importJobs = function(cb){
  console.log("dropping existing jobs table")
  models.Job.remove({}, function(err){
    cb(null)
  })
}

var importProjects = function(cb){
  cb(null)
}

var importSettings = function(cb){
  models.Config.remove({}, function(err){
    if (err) throw err
    new models.Config({version: 1}).save(cb)
  })
}

var dropDB = function(cb){
  // Can't simply drop the DB - need to retain the users table
  Object.keys(mongoose.connection.collections).forEach(function(collection){
    mongoose.connection.collections[collection].drop(function(err){
      console.log("Dropped collection", collection)
    })
    cb()
  })
 /* mongoose.connection.db.dropDatabase(function(err){
    console.log("!>")
    if(err) throw err;
    console.log("DB DROPPED")
    cb()
  })
  */
  console.log("!!!!!")
}

var connect = function(cb) {
  console.log("-->connecting")
  mongoose.connect(mongodbUrl)

  mongoose.connection.on('error',function (err) {
    console.log("ERROR: MONGOOSE CONNNECTION: ", err)
    process.exit(1)
  })

  mongoose.connection.on('disconnected', function (err, res) {
    console.log('Mongoose default connection disconnected', err, res);
  });


  mongoose.connection.on('connected', function (err, res) {
    if(err) throw err
    console.log("<--- connected", err, res)
    cb.apply(this, arguments) 
  });
}

module.exports = function(cb){
  async.series([
      connect
    , dropDB
    , importSettings
    , importUsers
    , importJobs
    , importProjects
    ]
    , function(err, stdout, stderr) {
      if (err) {throw err;}
      cb(null, config)
    })
}

if (!module.parent) {
  module.exports(function(){
    console.log("FIXTURES LOADED")

    process.exit(0)
  })
}
