var assert = require('chai').assert
  , fails = 0

module.exports = function(browser, done){
  var b = browser

  b.rel('/')
    .waitForVisibleByCssSelector("a.brand")
    // Login visible
    .waitForVisibleByCssSelector("#navbar-signin-form")

    // Bad creds fail
    .rel('/')
    .elementByName('email')
    .type('test1@example.com')
    .elementByName('password')
    .type('BAD CREDS')
    .elementById("navbar-signin-form", function(err, form){
      assert.isNull(err)
    })
    .submit()
    .url(function(err, url){
     assert.isNull(err)
     assert.include(url, "/login#fail")
    })

    // Forgot password flow
    .rel("/")
    .elementById("forgot-password-link")
    .click()
    .url(function(err, url){
      assert.isNull(err)
      assert.include(url, '/auth/forgot')
    })
    .elementByName('forgot-email')
    .type('test1@example.com')
    .elementById("send-forgot")
    .click()
    .elementByClassName('forgot-sent', function(err, el){
      assert.isNull(err, "Error on forgot-password-sent page")
    })
    
    // Submitting login form works
     .rel('/')
     .elementByName('email')
     .type('test1@example.com')
     .elementByName('password')
     .type('open-sesame')
     .elementById("navbar-signin-form")
     .submit()
     .elementByClassName('logged-in', function  (err, el) {
       assert.isNull(err)
       assert.ok(ok)
     })
   
     // Now we're logged in 
      .url(function(err, url){
        assert.isNull(err)
      })
      .elementByClassName('no-projects', function(err, el){
        assert.isNull(err)
        assert.ok(el)
      })
   
      // Link to github
     .elementByClassName('provider-github')
    .click()
    .waitForVisibleByClassName('octicon-logo-github', 6000, function(err){
      assert.isNull(err, "github didn't load")
    })
    .elementByName('login')
    .type('strider-test-robot')
    .elementByName('password')
    .type("i0CheCtzY0yv4WP2o")
    .elementByName('commit')
    .click()
    .waitForVisibleByClassName('StriderBlock_Brand', 6000, function(err){
      assert.isNull(err, "Timed out waiting for github auth")
    })

    // Add project from github
    .rel('/projects')
    .elementByClassName('add-repo')
    .click()
    .elementByCssSelector('.project-type.btn')
    .click()
    // start a test
    .waitForElementByCssSelector('.btn-success', 5000)
    .click()
    .waitForElementByLinkText('Click to watch it run', 3000)
    .click()
    .url(function(err, url){
      assert.isNull(err)
      assert.include(url, "strider-test-robot/strider-extension-loader")
    })

    // Go to test page
     .rel('/strider-test-robot/strider-extension-loader/')
     .elementByClassName('test-only-action')
     .click()


    .fail(function(){
      console.log("ERROR:", arguments)
      fails ++
      done(arguments)
    })
    .fin(function(){
      console.log("!FIN", arguments)
      b.quit(function () {
        done(null, fails)
      })
    }).done()

}

