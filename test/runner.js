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
  , wd = require('wd')
  , remote = JSON.parse(process.env.WEBDRIVER_REMOTE || '{}')
  , browsers = JSON.parse(process.env.BROWSERS || '[]' )

  // TESTS
var tests = ["./integration/login_test"]



// Monkey patch wd for test stuff

wd.webdriver.prototype.visibleByCss = wd.webdriver.prototype.waitForVisibleByCssSelector
wd.webdriver.prototype.visibleByClassName = wd.webdriver.prototype.waitForVisibleByClassName

wd.webdriver.prototype.rel = function(url, cb){
  return this.get("http://localhost:4000" + url, cb)
}

wd.webdriver.prototype.fillInForm = function(vals, cb){
  console.log("!! FILLIN FORM", vals)
  var steps = []
    , b = this

  Object.keys(vals).forEach(function(k){
    var v = vals[k]

    steps.push(function(stepCb){
      console.log("FIND", k, ":", v)
      b.elementByName(k, function(err, el){
        el.type(v, stepCb)
      })
    })
  })

  async.series(steps, cb)
}

var fails = 0;


require('./strider')(function(){
  async.map(browsers, function(conn, doneBrowser){
    var browser = wd.promiseChainRemote(remote)
    browser.init(conn)
    setTimeout(function(){
      browser.on('status', function(info) {
          console.log(info.cyan);
      });
      browser.on('command', function(meth, path, data) {
          console.log(' > ' + meth.yellow, path.grey, data || '');
      });
      browser.on('error', function(info) {
          console.log(red);
      });
      browser.get("http://localhost:4000/")

      async.map(tests, function(suite, cb){
          console.log("[Browser:", conn, "] -> ", suite)
          require(suite)(browser, cb)
        },
        function(err, failure){
          console.log("!!! FINIESHED")
          browser.quit()
          doneBrowser()
        }
        )
      }, 2000)
    }
  , function doneTests(){
      console.log("DONE TESTS", fails)
      process.exit(0)
    }
  )
})



