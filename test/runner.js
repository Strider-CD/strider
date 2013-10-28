// Shim so we can actually run mocha-selenium tests without the command.

var ms = require('mocha-selenium')

// We're not gonna use the mocha-selenium runner - let' steal the execute function out of it:

var _execute = ms.Runner.prototype.execute
  , _runner = {
    options: {
        config: process.cwd()
      , paths: ["./test/integration/login_test.js"]
      }
    , config : {
      run : "node test/strider.js"
    }
    , setup : ms.Runner.prototype.setup
    , run : ms.Runner.prototype.run
    , runOne: ms.Runner.prototype.runOne
    , env : {browsers : [["chrome", "", "Windows 8"]]}
  }

var execute = function(done){
  _execute.apply(_runner, [done])
}


execute(process.exit)
