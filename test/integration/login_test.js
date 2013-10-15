var sm = require('mocha-selenium')
  , assert = require('chai').assert
  , b = sm.setup('integration - login', {
      appCmd: 'make serve-test'
    })

var test = it; // Tests as english sucks. 'it' doesn't even make sens for half of these.

describe('login', function(){
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
    }).elementById("send-forgot", function(err, el){
      b.next("clickElement", el, function(){})
    }).url(function(err, url){
      console.log("!!", err, url)
      done()
    })


  })

  test("submitting form works", function(done){
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


})
