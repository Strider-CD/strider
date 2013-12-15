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
  var tests = [ './integration/build_page_test.js'
              , './integration/login_test.js'
              , './integration/global_admin_test.js'
              , './integration/github_test.js'
              ]

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

  describe('in each browser,', function () {
    async.each
    ( browsers
    , runTests
    )
  })

})



