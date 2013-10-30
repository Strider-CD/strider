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
  var steps = []
    , b = this

  Object.keys(vals).forEach(function(k){
    var v = vals[k]

    steps.push(function(stepCb){
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
      /*
      browser.on('status', function(info) {
          console.log(info.cyan);
      });
      browser.on('command', function(meth, path, data) {
          console.log(' > ' + meth.yellow, path.grey, data || '');
      });
      browser.on('error', function(info) {
          console.log(red);
      });
      */
      browser.get("http://localhost:4000/")

      async.map(tests, function(suite, cb){
          console.log("[Browser:", conn, "] -> ", suite)
          require(suite)(browser, cb)
        },
        function(err, failure){
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



