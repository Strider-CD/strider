var sm = require('mocha-selenium')
  , assert = require('chai').assert
  , b = sm.setup('integration tests', {
      appCmd: 'make serve-test'
    })

var test = it, suite = describe; // Tests as english sucks. 'it' doesn't even make sense for half of these.


suite('integration - existing user flow', function(){


  this.timeout(30 * 1000)

  before(function(done){
    b.rel('/', done)
  })


  test("render the homepage", function(done){
    b.visibleByCss("a.brand", function(err){
      done(err)
    })
  })

  test("render the login form", function(done){
    b.visibleByCss("#navbar-signin-form", function(err){
      done(err)
    })
  })

  test("submitting bad creds fails", function(done){
    b.chain()
     .rel('/')
     .fillInForm({
       email: 'test1@example.com',
       password: 'BAD CREDS' 
     }).elementById("navbar-signin-form", function(err, form){
       if (err) return done(err);
       b.next('submit', form, function(err, res){
         if (err) return done(err);
       })
     }).url(function(err, url){
       assert.isNull(err)
       assert.include(url, "/login#fail")
       done()
     })
  })

  test("follow forgot password flow", function(done){
    b.chain()
     .rel("/")
     .elementById("forgot-password-link", function(err, el){
       b.next('clickElement', el, function(){})
     })
    .url(function(err, url){
      assert.isNull(err)
      assert.include(url, '/auth/forgot')
    })
    .fillInForm({
      email : "test1@example.com"
    }, '.form-horizontal').elementById("send-forgot", function(err, el){
      b.next("clickElement", el, function(){})
    })
    .elementByClassName('forgot-sent', function(err, el){
      assert.isNull(err, "Error on forgot-password-sent page")
      done();
    })
  })

  test("submitting login form works", function(done){
    b.chain()
     .rel('/')
     .fillInForm({
       email: 'test1@example.com',
       password: 'open-sesame'
     })
     .elementById("navbar-signin-form", function(err, form){
       if (err) return done(err);
       b.next('submit', form, function(err, res){
         if (err) return done(err);
       })
     })
     .visibleByClassName('logged-in', function  (err, visible) {
       assert.isNull(err)
       assert.isTrue(visible)
       done(null)
     })
  })

  test("now we're logged in", function(done){
    b.chain()
      .url(function(err, url){
        assert.isNull(err)
      })
      .elementByClassName('no-projects', function(err, el){
        assert.isNull(err)
        assert.ok(el)
        done(null)
      })
  })

  test("link account to github", function(done){
    b.chain()
     .elementByClassName('provider-github', function(err, el){
        assert.isNull(err)
        assert.ok(el, "Couldn't find github link")
        b.next('clickElement', el, function(err, res){
          assert.isNull(err);
        })
     })
    .waitForVisibleByClassName('octicon-logo-github', 3000, function(err){
      assert.isNull(err, "github didn't load")
    })
    .fillInForm({
       // Github test account creds 
       login: "strider-test-robot"
     , password: "i0CheCtzY0yv4WP2o"
     })
    .elementByName('commit', function(err, el){
      assert.isNull(err)
      assert.ok(el)
      b.next('clickElement', el, function(err, res){
        assert.isNull(err)
      })
    })
    .waitForVisibleByClassName('StriderBlock_Brand', 3000, function(err){
      assert.isNull(err, "Timed out waiting for github auth")
      done()
    })
  })



  test("add a project from github repo", function(done){
    b.chain()
      .rel('/projects')
      .elementByClassName('add-repo', function(err, el){
        assert.isNull(err, "Error selecting 'add' button")
        assert.ok(el)
        b.next("clickElement", el, function(err, res){
          assert.isNull(err, "Error clicking add button")
        })
      })
      .elementByCssSelector('.project-type.btn', function(err, el){
        assert.isNull(err, "error selecting type button")
        assert.ok(el)
        b.next("clickElement", el, function(err, res){
          assert.isNull(err)
        })
      })
      /*
      .waitForElementByCssSelector('.btn-success', 5000, function(err, el){
        // Start a test
        assert.isNull(err, "error selecting success button")
        assert.ok(el)
        b.next("clickElement", el, function(err, res){
          assert.isNull(err)
        })
      })
      .waitForElementByLinkText('Click to watch it run', 3000, function(err, el){
        assert.isNull(err)
        assert.ok(el)
        b.next("clickElement", el, function(err, res){
          assert.isNull(err)
        })
      }).url(function(err, url){
        assert.isNull(err)
        assert.include(url, "strider-test-robot/strider-extension-loader")
        done()
      })
      */
      .url(function(err, url){
        done()
      })
  })

  /*
  test("run the project tests", function(done){
    throw "TODO"
    done() 
  })

  test("the dashboard should reflect test results", function(done){
    throw "TODO"
    done()
  })
*/

})


