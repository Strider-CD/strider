var async = require('async')
  , wd = require('wd')
, remote = JSON.parse(process.env.WEBDRIVER_REMOTE || '{"hostname":"localhost", "port":9515}')
  , browsers = JSON.parse(process.env.BROWSERS || '[{"browserName":"chrome"}]' )

  // TESTS
var tests = ["./integration/login_test.js", "./integration/build_page_test.js"]

wd.webdriver.prototype.rel = function(url, cb){
  return this.get("http://localhost:4000" + url, cb)
}

var fails = 0;
var START_TIMEOUT = 5000;

wd.addPromiseChainMethod('comment', function (text, done) {
  console.log('  # ' + text)
  return this
})

require('./strider')(function(){
  async.map(browsers, function(conn, doneBrowser){
    var commands = []
    async.map(tests, function(suite, cb) {
      var browser = wd.promiseChainRemote(remote)
      browser.on('status', function(info) {
        console.log(info);
      });
      browser.on('command', function(meth, path, data) {
        if (meth && path && data) commands.push([' command > ' + meth, path, JSON.stringify(data || '')].join(' '));
      });
      browser.on('error', function(info) {
        console.log(info);
      });
      require(suite)(browser.init(conn).get("http://localhost:4000/"), cb)
    }, function(err, failure){
      if (err) {
        console.log(commands.join('\n'))
      }
      doneBrowser(err)
    })
  }, function doneTests(err){
      if (err) {
        console.log("Webdriver tests failure")
        process.exit(1)
      }
      console.log("Webdriver tests success!")
      process.exit(0)
    }
  )
})



