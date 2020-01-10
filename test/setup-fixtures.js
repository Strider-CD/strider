var Step = require('step')
  , request = require('request')
  , config = require('./test-config')
  , models = require('../lib/models')
  , mongoose = require('mongoose')
  , mongodbUrl = process.env.STRIDER_TEST_DB || 'mongodb://localhost/stridercdtest'
  , async = require('async')
  , path = require('path')
  , fs = require('fs')
  , testUsers = require('./fixtures/users')(request);

console.log('Setting up fixtures: %s', mongodbUrl);

var importUsers = function (cb){
  //console.log('dropping existing users table')
  models.User.remove({}, function (err){
    if (err) throw err;

    //console.log('dropped')

    async.eachSeries(testUsers, function (u, done){
      var user = new models.User();
      user.email = u.email;
      user.account_level = u.account_level;
      user.set('password', u.password);

      if (u.noProjects) {
        return user.save(done);
      }
      models.Project.find({}, function (err, projects) {
        if (err) return done(err);
        user.projects = [];
        projects.forEach(function (p) {
          user.projects.push({
            name: p.name,
            display_name: p.display_name,
            access_level: 2
          });
        });
        user.save(function (err) {
          if (err) return done(err);
          if (u !== testUsers[1]) {
            return done();
          }
          models.Project.updateMany({}, {$set: {creator: user._id}}, done);
        });
      });
    }, function (err){
      cb(err, null);
    });
  });

};

function getFileFixture(name, done) {
  fs.readFile(path.join(__dirname, 'fixtures', name + '.json'), 'utf8', function (err, text) {
    if (err) return done(err);
    var data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      return done(new Error('failed to import fixture: ' + e.message));
    }
    done(null, data);
  });
}

var importJobs = function (cb){
  //console.log('dropping existing jobs table')
  models.Job.remove({}, function (err){
    getFileFixture('jobs', function (err, jobs) {
      models.Job.collection.insert(jobs, cb);
    });
  });
};

var importProjects = function (cb){
  models.Project.remove({}, function (err){
    getFileFixture('projects', function (err, jobs) {
      models.Project.collection.insert(jobs, cb);
    });
  });
};

var importConfig = function (cb){
  models.Config.remove({}, function (err){
    getFileFixture('config', function (err, configs) {
      models.Config.collection.insert(configs, cb);
    });
  });
};

var importSettings = function (cb){
  models.Config.remove({}, function (err){
    if (err) throw err;
    new models.Config({version: 1}).save(cb);
  });
};

var dropDB = function (cb){
  // Can't simply drop the DB - need to retain the users table
  var collections = Object.keys(mongoose.connection.collections);

  async.map(collections,
      function dropCollection(collection, done){
        //console.log('Dropping ', collection)
        mongoose.connection.collections[collection].drop(function (err){
          if (err && err.errmsg === 'ns not found') return done(null, collection);
          done(err, collection);
        });
      }
     , function done(err, res){
        //console.log(err, 'dropped', res)
       cb(err);
     }
  );
 /* mongoose.connection.db.dropDatabase(function(err){
    console.log('!>')
    if(err) throw err;
    console.log('DB DROPPED')
    cb()
  })
  */
};

var connect = function (cb) {
  //console.log('-->connecting')
  mongoose.connect(mongodbUrl);

  mongoose.connection.on('error',function (err) {
    console.log('ERROR: MONGOOSE CONNNECTION: ', err);
    process.exit(1);
  });

  mongoose.connection.on('disconnected', function (err, res) {
    //console.log('Mongoose default connection disconnected', err, res);
  });


  mongoose.connection.on('connected', function (err, res) {
    if(err) throw err;
    //console.log('<--- connected')
    cb.apply(this, arguments);
  });
};

module.exports = function (cb){
  async.series([
    connect
    , dropDB
    , importSettings
    , importProjects
    , importUsers
    , importJobs
    , importConfig
  ]
    , function (err, stdout, stderr) {
    if (err) {throw err;}
    config.db_uri = mongodbUrl;
    cb(null, config);
  });
};

if (!module.parent) {
  module.exports(function (){
    //console.log('FIXTURES LOADED')

    process.exit(0);
  });
}
