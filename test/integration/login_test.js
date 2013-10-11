var sm = require('mocha-selenium')
  , b = sm.setup('integration - login', {
      appCmd: 'node test/strider.js'
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
    b.elementByName('email', function(err, el){
      if (err) return done(err);
      b.type(el, "test1@example.com", function(err){
        if (err) return done(err);
        b.elementByName('password', function(err, el){
          if (err) return done(err);
          b.type(el, "open-sesame", function(err){
            if (err) return done(err);
            b.elementById("navbar-signin-form", function(err, form){
              if (err) return done(err);
              b.submit(form, function(err, res){
                if (err) return done(err);
                setTimeout(function(){
                 b.elementByClassName('logged-in', function(err){
                  if (err) return done(err);
                  done(null); 
                 }) 
              
                }, 2000) 

              }) 
            })
          })
        })
      })  
    })
  })


})
