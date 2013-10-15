var sm = require('mocha-selenium')
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

  it("submitting form works", function(done){
    flow(
        ['elementByName', 'email']
      , ['type', "$", 'test1@example.com']
      , ['elementByName', 'password']
      , ['type', "$", 'opensesame']
      , ['elementById', 'navbar-signin-form']
      , ['submit', "$"]
      , function(err, res){
        if (err) throw err;

        setTimeout(function(){
         b.elementByClassName('logged-in', function(err){
          if (err) console.log("!!", err)
          if (err) throw err;
          done(null); 
         })
        }, 2000)
      }
    )
  })

 //it("logged in user "


})
