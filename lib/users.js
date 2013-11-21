
var utils = require('./utils')
  , models = require('./models')
  , email = require('./email')

  , Project = models.Project
  , User = models.User

module.exports = {
  makeAdmin: makeAdmin
}

function makeAdmin(user, done) {
  if ('string' !== typeof user && user.email) user = user.email
  User.update({email: user}, {account_level: 1}, {}, function (err, num) {
    if (err) return done(err)
    if (!num) return done()
    console.log("Admin status granted to: " + user)

    // if in production, notify core about new admin
    if (process.env.NODE_ENV === "production") {
      email.notify_new_admin(user)
    }
    done(null, num)
  })
}
