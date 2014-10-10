var async = require('async')
  , wd = require('wd')
  , remote = JSON.parse(process.env.WEBDRIVER_REMOTE || '{"hostname":"localhost", "port":9515}')
  , browsers = JSON.parse(process.env.BROWSERS || '[{"browserName":"chrome"}]' )
  , strider = require('./strider')
  , chai = require("chai")
  , chaiAsPromised = require("chai-as-promised")


require('mocha-as-promised')()
chai.use(chaiAsPromised)
chai.should()
chaiAsPromised.transferPromiseness = wd.transferPromiseness

describe('Strider', function () {
  this.timeout(20000)

  // TESTS
  var tests = (
    process.env.TEST_SUITE ? 
    [ './integration/'+process.env.TEST_SUITE+'.js' ] :
    [ './integration/build_page_test.js'
    , './integration/login_test.js'
    , './integration/global_admin_test.js'
    , './integration/github_test.js'
    , './integration/branch_management_test.js'
  ])

  wd.addPromiseChainMethod('rel', function (url, cb) {
    return this.get("http://localhost:4000" + url, cb)
  })

  var runTests = function (conn, doneBrowser) {
    var commands = []
    async.each
    ( tests
    , function (suite, cb) {
        var browser = wd.promiseChainRemote(remote)
        browser.on('status', function(info) {
          console.log(info)
        })
        browser.on('command', function(meth, path, data) {
          if (meth && path && data) commands.push([' command > ' + meth, path, JSON.stringify(data || '')].join(' '))
        })
        browser.on('error', function(info) {
          console.log(info)
        })
        require(suite)(browser.init(conn).get("http://localhost:4000/"), cb)
      }
    , function(err){
        if (err) {
          console.log(commands.join('\n'))
        }
        doneBrowser(err)
      }
    )
  }

  before(function (done) {
    strider(function () {
      done()
    })
  })

  /**
   * Screenshots and current test are dumped into a failures/ dir in project root */
  var mkdirp = require('mkdirp');
  var fs = require('fs');
  var path = require('path');
  var runstamp = new Date().getTime().toString();
  var failuresDir = path.join(__dirname, '..', 'failures', runstamp);

  afterEach(function (done) {
    var test = this.currentTest;
    if (test.state !== "failed") return done();
    var timestamp = new Date().getTime().toString();
    var scopeDir = path.join(failuresDir, timestamp);
    mkdirp(scopeDir, function (err) {
      if (err) return done(err);
      test.browser.takeScreenshot(function (err, base64Data) {
        if (err) return done(err);
        var png = path.join(scopeDir, "screenshot.png");
        fs.writeFile(png, base64Data, 'base64', function(err) {
          if (err) return done(err);
          console.log('Failure screenshot saved to '+png)
          var json = path.join(scopeDir, "currentTest.json");
          fs.writeFile(json, JSON.stringify({
            title: test.title,
            duration: test.duration,
            state: test.state,
            err: test.err,
            'jsonwire-error': test['jsonwire-error']
          }, null, 4), function (err) {
            if (err) return done(err);
            console.log('Failure metadata saved to '+json)
            done();
          })
        });
      })
    });
  })

  describe('in each browser,', function () {
    async.each
    ( browsers
    , runTests
    )
  })

})



