
var models = require('../')
  , async = require('async')

// done(err)
module.exports = {
  ensure: ensure,
  isNeeded: isNeeded,
  upgrade: upgrade,
  isFreshDb: isFreshDb,
  needConfigObj: needConfigObj,
}

var upgrades = {
  0: require('./from0to1')
}

function ensure(version, done) {
  isNeeded(version, function (err, needed, oldv, newv, config) {
    if (err) return done(err)
    if (!needed) return done()
    if (process.env.STRIDER_DB_UPGRADE !== 'yes') {
      console.error("Your Strider database needs to be upgraded!\n")
      console.log("Please:")
      console.log("1) Backup your database")
      console.log("2) Re-run setting environment variable:\n")
      console.log("STRIDER_DB_UPGRADE=yes")
      console.log("e.g. $ env STRIDER_DB_UPGRADE=yes npm start")
      process.exit(0)
    } else {
      console.log("STRIDER_DB_UPGRADE is set to yes")
      console.log('Updating database from version %d to %d', oldv, newv)
      upgrade(oldv, newv, function (err) {
        if (err) return done(err)
        config.save(done)
      })
    }
  })
}

function upgrade(oldv, newv, done) {
  var tasks = []
  for (var i=oldv; i<newv; i++) {
    tasks.push(upgrades[i])
  }
  async.series(tasks, done)
}

function isNeeded(version, done) {
  models.User.find({}, function (err, users) {
    models.Config.find({}, function (err, configs) {
      if (err) return done(err)
      if (configs && configs.length > 1) {
        return done(new Error('Multiple `Config`s found in the database. Only one is allowed'))
      }
      var config
      , oldversion
      if (!configs || configs.length === 0) {
        config = new models.Config({version: 0})
        if (!users || !users.length) config.version = version
        return config.save(function() { done(null, false) })
      } else {
        config = configs[0]
      }
      if (config.version >= version) {
        return done(null, false)
      }
      oldversion = config.version
      config.version = version
      done(err, true, oldversion, version, config)
    })
  })
}
  
function isFreshDb(cb) {
  models.User.count(function(err, res) {
    if (err) throw err
    if (res === 0) {
      return cb(null, true)
    }
    return cb("there are users.", false)
  })
}

function needConfigObj(cb) {
  models.Config.count(function(err, res) {
    if (err) throw err
    if (res === 0) {
      return cb(null, true)
    }
    return cb("there are " + res + "configs.", false)
  })
}
