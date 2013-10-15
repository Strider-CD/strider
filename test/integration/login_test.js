var sm = require('mocha-selenium')
  , assert = require('chai').assert
  , b = sm.setup('integration - login', {
      appCmd: 'make serve-test'
    })


var _prev = null
var flow = function(){
  var _arguments = Array.prototype.slice.call(arguments)
    , cmd = _arguments.shift()

  if (typeof(cmd) == "function"){
    return cmd(null, _prev)
  }

  var method = cmd[0]
    , args = []

  for (var i = 1; i< cmd.length; i++){
    if (cmd[i] == '$')
      args.push(_prev)
    else
      args.push(cmd[i]);
  }

  //console.log(">", method, ":", args)
  args.push(function(err, res){
    if (err) throw err;
    _prev = res
    return flow.apply(this, _arguments);
  })
  b[method].apply(b, args)
}







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
 
  it("submitting bad creds fails", function(done){
    b.chain()
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
       b.get(url.slice(0, -10), done)
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
       assert.isNull(err)
       assert.isTrue(visible)
       done(null)
     })
  })


})
