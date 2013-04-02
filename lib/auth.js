var config = require('./config')
  , logging = require('./logging')
  , passport = require('passport')
  , GithubStrategy = require('passport-github').Strategy
  , LocalStrategy = require('passport-local').Strategy
  , User = require('./models').User




/* Assign all the various properties coming from github to the user document */
function ghUserLink(ghProfile, ghAccessToken, user) {
  var ghUser = ghProfile._json

  var github = {
            id: ghUser.id
          , type: ghUser.type
          , login: ghUser.login
          , accessToken: ghAccessToken
          , gravatarId: ghUser.gravatar_id
          , name: ghUser.name
          , email: ghUser.email
          , publicRepoCount: ghUser.public_repo_count
          , publicGistCount: ghUser.public_gist_count
          , followingCount: ghUser.following_count
          , followersCount: ghUser.followers_count
          , company: ghUser.company
          , blog: ghUser.blog
          , location: ghUser.location
          , permission: ghUser.permission
          , createdAt: ghUser.created_at
          // Private data
          , totalPrivateRepoCount: ghUser.total_private_repo_count
          , collaborators: ghUser.collaborators
          , diskUsage: ghUser.disk_usage
          , ownedPrivateRepoCount: ghUser.owned_private_repo_count
          , privateGistCount: ghUser.private_gist_count
          , plan: (ghUser.plan) ? 
            {
                name: (ghUser.plan.name) ? ghUser.plan.name : ""
              , collaborators: (ghUser.plan.collaborators) ? ghUser.plan.collaborators: ""
              , space: (ghUser.plan.space) ? ghUser.plan.space : ""
              , privateRepos: (ghUser.plan.private_repos) ? ghUser.plan.private_repos : ""
            } : {}
    };
    user.set('github', github);

}




var setupGithubAuth = function(app){
  passport.use(new GithubStrategy({
    clientID : config.github.appId
    , clientSecret: config.github.appSecret
    , callbackURL : config.github.myHostname + "/auth/github/callback"
    , passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done){
      if (!req.user){
        return done("Cannot sign up with github - you must link it to account");
      } 
      ghUserLink(profile, accessToken, req.user);
      req.user.save(function(e){
          if(e) throw e;
          done(null, req.user);
        });
      }))
}

var setupPasswordAuth = function(app){
  passport.use(new LocalStrategy({usernameField:'email'},
      function(username, password, done){
        console.log("username: %s", username);
        User.authenticate(username, password, function (err, user) {
          if (err || !user) {
            console.log("no user");
            return done(null, false, { message: 'Incorrect username.' });
          }
          return done(null, user); 
          })
  }))
}


var registerRoutes = function(app){
  app.get('/register', function(req, res, next){
    return res.render('register.html', {});
  })

  app.post('/register', function(req, res, next){

    // Quick and dirty validation
    var errors = []
    if (!req.body.invite_code) errors.push("No invite code specified")
    if (!req.body.email) errors.push("Missing email")
    if (!req.body.password) errors.push("Missing password")
    if (errors.length){
      return res.render('register.html', {errors: errors});
    }

    User.registerWithInvite(
      req.body.invite_code, req.body.email, req.body.password
      , function(err, user){
        if (err){
          return res.render('register.html', {
              errors: [err]
            , invite_code: req.body.invite_code
            , email: req.body.email
            , password: req.body.password
          });
        }

        // Registered success:
        req.login(user, function(err, u){
          res.redirect('/');
        })
      });
  });

  app.get('/login', function(req, res, next){
    return res.render('login.html', {});
  })

  app.get('/auth/github',
    passport.authenticate('github'));

  app.get('/auth/github/callback'
      , passport.authenticate('github', { failureRedirect: '/login' })
      , function(req, res){
        res.redirect('/add_repo')
      })

}


var setup = function(app){

  setupPasswordAuth(app);
  setupGithubAuth(app);

  // serialize user on login
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // deserialize user on logout
  passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });

  app.use(passport.initialize())
  app.use(passport.session())

  // Middleware to setup view parameters with user
  app.use(function(req, res, next){
    res.locals.currentUser = req.user || null;
    next();
  })

  registerRoutes(app);
}

var _authenticate = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login#fail'
})

var logout = function(req, res, next){
  req.logout()
  res.redirect('/');
}

module.exports = {
    setup:setup
  , authenticate: _authenticate
  , logout: logout
};
