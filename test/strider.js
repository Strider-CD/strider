/*
 *  Setup fixtures, run Strider.
 *
 *  Nothing else, please.
 */ 

require('./setup-fixtures')(function(err, config) {
  console.log(config)
  process.env.DB_URI = config.db_uri
  var child = require('child_process').spawn("bin/strider", ["--config", 'test/test-config.json'], { 
    env : process.env,
    stdio: 'inherit',
    detached: false,
  })
  process.on('SIGTERM', function() {
    child.kill('SIGKILL')
    process.exit(0)
  })
})
