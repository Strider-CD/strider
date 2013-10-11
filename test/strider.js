/*
 *  Setup fixtures, run Strider.
 *
 *  Nothing else, please.
 */ 

require('./setup-fixtures')(function(err, config){
  console.log(config)
  require('child_process').spawn("bin/strider", [], { 
      env : { DB_URI : config.db_uri  }
    , stdio: 'inherit' 
  })
})
