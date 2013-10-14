var Step = require('step')
  , request = require('request')
  , config = require('../test-config')

var TEST_PORT=8700;
var TEST_BASE_URL="http://localhost:"+TEST_PORT+"/";
var TEST_WEBHOOK_SHA1_SECRET="l1ulAEJQyOTpvjz7r4yNtzZlL4vsV8Zy/jatdRUxvJc=";
TEST_USER_PASSWORD = "open-sesame";
var TEST_USERS = {
  "test1@example.com":{password: TEST_USER_PASSWORD, jar: request.jar()},
  "test2@example.com":{password: TEST_USER_PASSWORD, jar: request.jar()},
  "test3@example.com":{password: TEST_USER_PASSWORD, jar: request.jar()}
};


var importUsers = function(cb){

}

var importJobs = function(cb){

}

var importProjects = function(cb){

}

module.exports = function(cb){
  Step(
    function() {
      importUsers(this.parallel());
      importJobs(this.parallel());
      importProjects(this.parallel());
    },
    function(err, stdout, stderr) {
      if (err) {throw err;}
      cb(null, config)
    })
}

module.exports(function(){
  console.log("!!", arguments)
})

