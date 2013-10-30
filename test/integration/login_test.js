var assert = require('chai').assert
  , tap = require('tap')
  , test = tap.test
  , fails = 0

module.exports = function(browser, done){
  var b = browser

  b.rel('/')
    .visibleByCss("a.brand", function(err){
      assert.isNull(err)
    })

    // Login visible
    .visibleByCss("#navbar-signin-form", function(err){
      assert.isNull(err)
    })

    // Bad creds fail
    .rel('/')
    .fillInForm({
     email: 'test1@example.com',
     password: 'BAD CREDS' 
    })
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
    .fillInForm({
      "forgot-email" : "test1@example.com"
    }).elementById("send-forgot")
    .click()
    .elementByClassName('forgot-sent', function(err, el){
      assert.isNull(err, "Error on forgot-password-sent page")
    })
    
    // Submitting login form works
     .rel('/')
     .fillInForm({
       email: 'test1@example.com',
       password: 'open-sesame'
     })
     .elementById("navbar-signin-form")
     .submit()
     .visibleByClassName('logged-in', function  (err, visible) {
       assert.isNull(err)
       assert.isTrue(visible)
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
    .fillInForm({
       // Github test account creds 
       login: "strider-test-robot"
     , password: "i0CheCtzY0yv4WP2o"
     })
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
    
    .fail(function(){
      console.log("ERROR:", arguments)
      fails ++
    })
    .fin(function(){
      console.log("!FIN", arguments)
      done(null, fails)
    })

}

