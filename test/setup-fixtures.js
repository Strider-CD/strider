var Step = require('step')
  , path = require('path')
  , request = require('request')
  , config = require('../test-config')
  , exec = require('child_process').exec

// parses a uri of the form mongodb://user:pass@host:post/dbname
function parseMongoURI(uri) {
  var db_name = uri.slice(uri.lastIndexOf('/') + 1);
  uri = uri.slice(uri.indexOf('://') + 3, uri.lastIndexOf('/'));
  var parts = uri.split('@');
  var db_host = parts[1];
  var authparts = parts[0].split(':');
  return {
    name: db_name,
    host: db_host,
    user: authparts[0],
    password: authparts[1]
  };
}

function toModel(collectionName) {
  var name = toTitleCase(collectionName);
  if (models[name]) {
    return models[name];
  } else if (models[name.slice(0, -1)]) {
    return models[name.slice(0, -1)];
  }
  throw Error('model for collection ' + collectionName + ' not found');
}

function toTitleCase(name) {
  return name[0].toUpperCase() + name.slice(1);
}

function fake_mongo_import(name, fname, cb) {
  var text = fs.readFileSync(fname).toString('utf8').replace(/\n/g, ',\n')
    , data = JSON.parse('[' + text.slice(0, -2) + ']')
    , model = toModel(name);
  model.remove({}, function (err) {
    if (err) return cb(err);
    model.create(data, cb);
  });
}

  
var TEST_PORT=8700;
var TEST_BASE_URL="http://localhost:"+TEST_PORT+"/";
var TEST_WEBHOOK_SHA1_SECRET="l1ulAEJQyOTpvjz7r4yNtzZlL4vsV8Zy/jatdRUxvJc=";
TEST_USER_PASSWORD = "open-sesame";
var TEST_USERS = {
  "test1@example.com":{password: TEST_USER_PASSWORD, jar: request.jar()},
  "test2@example.com":{password: TEST_USER_PASSWORD, jar: request.jar()},
  "test3@example.com":{password: TEST_USER_PASSWORD, jar: request.jar()}
};

var has_mongo_import = true;
function importCollection(name, file, cb) {
  var filepath = path.join(__dirname, 'fixtures', file)
    , db_data = { name: path.basename(config.db_uri) };

  console.log("Loading test data ...");

  if (process.env.MONGODB_URI !== undefined) {
    db_data = parseMongoURI(process.env.MONGODB_URI);
  }

  if (process.env.MONGODB_USER !== undefined) {
    db_data.user = process.env.MONGODB_USER;
  }

  if (process.env.MONGODB_PASSWORD !== undefined) {
    db_data.password = process.env.MONGODB_PASSWORD;
  }

  var cmd = "mongoimport --drop -c " + name + " ";

  if (db_data.user && db_data.password) {
    cmd = cmd + " -u " + db_data.user + " -p " + db_data.password;
  }

  if (db_data.host !== undefined) {
    cmd += ' --host ' + db_data.host;
  }

  if (db_data.port !== undefined) {
    cmd = cmd + " --port " + db_data.port;
  }

  cmd = cmd + " -d " + db_data.name + " --file " + filepath;

  console.log("Loading data with command: %s", cmd);

  if (has_mongo_import) {
    exec(cmd, function (err, stdout, stderr) {
      if (err && err.code === 127) { // no mongoimport available
        has_mongo_import = false;
        return fake_mongo_import(name, filepath, cb);
      }
      cb.apply(null, arguments);
    });
  } else {
    fake_mongo_import(name, filepath, cb);
  }
}


module.exports = function(cb){
  Step(
    function() {
      importCollection("users", "users.json", this.parallel());
      importCollection("jobs", "jobs.json", this.parallel());
      importCollection("projects", "projects.json", this.parallel());
    },
    function(err, stdout, stderr) {
      if (err) {throw err;}
    
      cb(null, config)    
    })
}
