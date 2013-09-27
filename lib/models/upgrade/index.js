
var models = require('../')
  , async = require('async')

// done(err)
module.exports = {
  ensure: ensure,
  isNeeded: isNeeded,
  upgrade: upgrade
}

var upgrades = {
  0: require('./from0to1')
}

function ensure(version, done) {
  isNeeded(version, function (err, needed, oldv, newv) {
    if (err) return done(err)
    if (!needed) return done()
    if (process.env.STRIDER_DB_UPGRADE !== 'yes') {
      console.log("Your Strider database needs to be upgraded.")
      console.log("Please make sure you take a backup and then re-run with environment variable STRIDER_DB_UPGRADE=yes")
    } else {
      console.log("STRIDER_DB_UPGRADE is set to yes")
      console.log('Updating database from version %d to %d', oldv, newv)
      upgrade(oldv, newv, done)
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
  models.Config.find({}, function (err, configs) {
    if (err) return done(err)
    if (configs && configs.length > 1) {
      return done(new Error('Multiple `Config`s found in the database. Only one is allowed'))
    }
    var config
      , oldversion
    if (!configs || configs.length === 0) {
      config = new models.Config({version: 0})
    } else {
      config = configs[0]
    }
    if (config.version >= version) {
      return done(null, false)
    }
    oldversion = config.version
    config.version = version
    config.save(function (err) {
      done(err, true, oldversion, version)
    })
  })
}
  
