/*
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
    , env : {browsers : []
      , hostname: "foo"
      , port: 888
      , auth: {username: "foo"
        , password: "bar"
      }
    }
  }

var envBrowsers = JSON.parse(process.env.BROWSERS || '[{"version" :"", "browserName" :"chrome", "platform" :"Linux"}]')
console.log("!!!", envBrowsers)

envBrowsers.forEach(function(b){
  _runner.env.browsers.push([b.browserName, b.version, b.platform])
})

if (process.env.WEBDRIVER_REMOTE){ //{"hostname":"ondemand.saucelabs.com","port":80,"username":"strider-public-ci"}
  var wdr = JSON.parse(process.env.WEBDRIVER_REMOTE)
  _runner.env.hostname = wdr.hostname
  _runner.env.port = wdr.port
  _runner.env.auth = {username : wdr.username, password: wdr.accessKey}

} else { //Chromedriver crap
  _runner.env.hostname = ""
}


var execute = function(done){
  _execute.apply(_runner, [done])
}


execute(process.exit)
*/

/// ----- NEW STUFF -----
var async = require('async')

// TESTS
var tests = ["./integration/login_test"]

var wd = require('wd')
  , remote = JSON.parse(process.env.WEBDRIVER_REMOTE || '{}')
  , browsers = JSON.parse(process.env.BROWSERS || '[]' )


// Monkey patch wd for test stuff

wd.webdriver.prototype.visibleByCss = wd.webdriver.prototype.waitForVisibleByCssSelector
wd.webdriver.prototype.rel = function(url){
  var cb = wd.findCallback(arguments)

  this.get("http://localhost:4000" + url, cb)
}



require('./strider')(function(){
  async.map(browsers, function(conn, doneBrowser){
    var browser = wd.promiseChainRemote(remote)
    browser.init(conn, function(){

      browser.on('status', function(info) {
          console.log(info.cyan);
      });
      browser.on('command', function(meth, path, data) {
          console.log(' > ' + meth.yellow, path.grey, data || '');
      });

      async.map(tests, function(suite, cb){
          console.log("[Browser:", conn, "] -> ", suite)
          require(suite)(browser, cb)
        },
        doneBrowser
        )
      })
    }
    , function doneTests(){
        process.exit(0)
      }
    )
})



