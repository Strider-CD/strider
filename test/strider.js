/*
 *  Setup fixtures, run Strider.
 *
 *  Nothing else, please.
 */ 

require('./setup-fixtures')(function(err, config){
  console.log(config)
  process.env.DB_URI = config.db_uri
  require('child_process').spawn("bin/strider", [], { 
      env : process.env
    , stdio: 'inherit' 
  })
})
