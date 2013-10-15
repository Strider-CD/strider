var sm = require('mocha-selenium')
  , expect = require('chai').expect
  , b = sm.setup('integration - login', {
      appCmd: 'make serve-test'
    })



describe('login', function(){
  this.timeout(30 * 1000)

  before(function(done){
    b.rel('/', done)
  })


  it("should render the homepage", function(done){
    b.visibleByCss("a.brand", function(err){
      done(err)
    }) 
  })

  it("should render the login form", function(done){
    b.visibleByCss("#navbar-signin-form", function(err){
      done(err)
    }) 
  })

  it("submitting form works", function(done){
    b.chain()
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
       expect(err).to.not.be.ok
       expect(visible).to.be.ok
       done(null)
     })
  })

})
