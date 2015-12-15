'use strict';

var crypto = require('crypto');
var BluebirdPromise = require('bluebird');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var utils = require('./utils');
var mailer = require('./email');
var config = require('./config');
var logging = require('./logging');
var User = require('./models').User;
var randomBytes = BluebirdPromise.promisify(crypto.randomBytes);

var setupPasswordAuth = function(app) {
  passport.use(new LocalStrategy({
    usernameField: 'email'
  }, function(username, password, done) {
    console.log('username: %s', username);

    User.authenticate(username, password, function (err, user) {
      if (err || !user) {
        console.log('no user');
        return done(null, false, { message: 'Incorrect username.' });
      }

      return done(null, user);
    });
  }));
};


var registerRoutes = function(app) {
  app.get('/register', function(req, res, next) {
    return res.render('register.html', {});
  });

  app.post('/register', function(req, res, next) {

    // Quick and dirty validation
    var errors = [];

    if (!req.body.invite_code) errors.push('No invite code specified')
    if (!req.body.email) errors.push('Missing email')
    if (!req.body.password) errors.push('Missing password')

    if (errors.length) {
      return res.render('register.html', { errors: errors });
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
    if (req.user) {
      return res.redirect('/');
    }

    var failed = Boolean(req.query.failed);
    var errors = [];

    if (failed) {
      errors.push('Authentication failed, please supply a valid email/password.');
    }

    return res.render('login.html', {
      errors: errors
    });
  })

}


function setup(app) {
  app.registerAuthStrategy = function(strategy) {
    passport.use(strategy);
  };

  app.authenticate = function() {
    console.log('AUTHENTICATE', arguments);

    var res = passport.authenticate.apply(passport, arguments);
    console.log('!!!', res);

    return function(req) {
      console.log('>>>> AUTHENTICATE', req._passport, req._passport.instance._strategies.github);
      res.apply(this, arguments);
    }
  }

  setupPasswordAuth(app);

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

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(basicAuth);

  // Middleware to setup view parameters with user
  app.use(function(req, res, next) {
    if (req.user) {
      req.user.gravatar = utils.gravatar(req.user.email);
    }

    res.locals.currentUser = req.user || null;
    next();
  });

  registerRoutes(app);
}

function basicAuth(req, res, next) {
  var auth, parts, plain;

  if (!(auth = req.get('authorization'))) return next();
  parts = auth.split(' ')
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'basic') return next();
  try {
    plain = new Buffer(parts[1], 'base64').toString().split(':')
  } catch (e) {
    console.error('Invalid base64 in auth header')
    return next()
  }
  if (plain.length < 2) {
    console.error('Invalid auth header')
    return next()
  }

  User.authenticate(plain[0], plain.slice(1).join(':'), function (err, user) {
    if (err || !user) {
      console.log('basic auth: user not found');
      return res.send(401, 'Invalid username/password in basic auth')
    }

    req.user = user;

    return next();
  })
}

var _authenticate = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login?failed=true'
});

var logout = function(req, res, next) {
  req.logout();
  res.redirect('/');
};

var forgot = function(req, res) {
  var email = req.body.email.toLowerCase();

  User.findOne({ email: { $regex : new RegExp(email, 'i') } }, function (error, user) {
    if (error) {
      req.flash('error', 'An error occured while attempting to reset your password.');
      return res.redirect('/forgot');
    }

    if (user) {
      randomBytes(20).then(function (buffer) {
        return buffer.toString('hex');
      }).then(function (token) {
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        return new BluebirdPromise(function (resolve, reject) {
          user.save(function(err, u) {
            if (err) {
              reject(err);
            } else {
              resolve(u);
            }
          });
        });
      }).then(function (user) {
        mailer.send_password_reset(user);
        req.flash('info', 'Please check your email for the password reset url. Thank you!');
        res.redirect('/');
      }).catch(function (error) {
        console.error('Password reset error: ', error);
      });
    }
    else {
      req.flash('error', 'We could not find a user with that email.');
      return res.redirect('/forgot');
    }
  });
};

var reset = function(req, res) {
  var token = req.params.token;

  User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }

    res.render('reset.html', {
      token: token,
      user: user
    });
  });
};

var resetPost = function (req, res) {
  var password = req.body.password;
  var confirmation = req.body.passwordConfirmation;
  
  if (password === confirmation) {
    User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('back');
      }

      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      user.save(function(err) {
        if (err) {
          req.flash('error', 'Couldn\'t save changes with new password.');
          return res.redirect('/');
        }

        req.login(user, function(err){
          if (err) {
            req.flash('error', 'You\'r user authentication was not successful.');
          }

          res.redirect('/');
        })
      });
    });
  } else {
    res.redirect(req.header('Referer'));
  }
};

// Require a logged in session
var requireUser = function require_auth(req, res, next) {
  if (req.user) {
    next();
  } else {
    req.session.return_to = req.url
    res.redirect("/login");
  }
};

var requireUserOr401 = function (req, res, next){
  if (req.user){
    next();
  } else {
    res.status(401).send('not authorized');
  }
};

// Require admin privileges
var requireAdminOr401 = function require_admin(req, res, next){
  if (!req.user || !req.user['account_level'] || req.user.account_level < 1) {
    res.status(401).send('not authorized');
  } else {
    next();
  }
};

// Require the logged-in user to have admin access to the repository in the
// URI path.
// E.g. http://striderapp.com/beyondfog/strider/latest_build
var requireProjectAdmin = function(req, res, next) {
  if (!req.project) return res.send(404, 'Project not loaded')
  if (!req.user) return res.send(401, 'No user')
  var isAdmin = req.user.account_level && req.user.account_level > 0
    , notAuthed = (!req.accessLevel || req.accessLevel < 2) && !isAdmin
  if (notAuthed) return res.send(401, 'Not authorized for configuring this project')
  next()
}

module.exports = {
  setup: setup,
  authenticate: _authenticate,
  logout: logout,
  forgot: forgot,
  reset: reset,
  resetPost: resetPost,

  // Auth middleware
  requireUser: requireUser,
  requireUserOr401: requireUserOr401,
  requireAdminOr401: requireAdminOr401,
  requireProjectAdmin: requireProjectAdmin
};
