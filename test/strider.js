var httpcheck = require('httpcheck')


/*
 *  Setup fixtures, run Strider.
 *
 *  Nothing else, please.
 */ 

module.exports = function(done){
  require('./setup-fixtures')(function(err, config) {
    process.env.DB_URI = config.db_uri
    process.env.PORT = 4000
    var child = require('child_process').spawn("bin/strider", ["--config", 'test/test-config.json'], { 
      env : process.env,
      stdio: process.env.TEST_STRIDER ? 'inherit' : undefined,
      detached: false,
    })

    process.on('SIGTERM', function() {
      child.kill('SIGKILL')
      process.exit(0)
    })
    process.on('exit', function(){
      child.kill('SIGKILL')
    })

    child.on('exit', function(code) {
      process.exit(code)
    })

    // Wait for strider to come up...
    httpcheck({
      url:"http://localhost:" + process.env.PORT + "/status",
      check: function(res) {
        return res && res.statusCode === 200;
      },
      log: function(){}
    }, function(err) {
      if (err) {
        console.error("App has not started up");
        process.exit(1);
      }
      console.log("Strider has passed health check")
      done();
    })
  })
}
