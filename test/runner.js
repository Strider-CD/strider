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
    , env : {browsers : []}
  }

var envBrowsers = JSON.parse(process.env.BROWSERS || '[{"version" :"", "browserName" :"chrome", "platform" :"Linux"}]')
console.log("!!!", envBrowsers)

envBrowsers.forEach(function(b){
  _runner.env.browsers.push([b.browserName, b.version, b.platform])
})


var execute = function(done){
  _execute.apply(_runner, [done])
}


execute(process.exit)
