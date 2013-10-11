/*
 *  Setup fixtures, run Strider.
 *
 *  Nothing else, please.
 */ 



require('child_process').spawn("bin/strider", [], { 
    env : {
      DB_URI : db      
    }
  , stdio: 'inherit' })
