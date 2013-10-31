var _ = require('underscore')
  , expect = require('chai').expect
  , fs = require('fs')
  , path = require('path')

// HACK because our config file isn't a function ... should we make it one?
function reqonce(name) {
  var full = path.resolve(path.join(__dirname, name))
    , mod = require(name)
  delete require.cache[full]
  return mod
}

describe('config', function () {
  it('should pick up legacy github variables', function () {
    var oe = process.env
      , config
    process.env = _.extend({}, process.env, {
      APP_ID: 'one',
      APP_SECRET: 'two'
    })
    config = reqonce('../../lib/config.js')
    expect(config.plugins.github.appId).to.equal('one')
    expect(config.plugins.github.appSecret).to.equal('two')
    process.env = _.extend({}, oe, {
      GITHUB_APP_ID: 'one',
      GITHUB_SECRET: 'two'
    })
    config = reqonce('../../lib/config.js')
    expect(config.plugins.github.appId).to.equal('one')
    expect(config.plugins.github.appSecret).to.equal('two')
    process.env = oe
  })

  it('should pick up non-prefixed items', function () {
    var oe = process.env
      , config
    process.env = _.extend({}, process.env, {
      PORT: 5001,
      SERVER_NAME: 'local',
      SESSION_SECRET: 'sec'
    })
    config = reqonce('../../lib/config.js')
    expect(config.port).to.equal(5001)
    expect(config.server_name).to.equal('local')
    expect(config.session_secret).to.equal('sec')
    process.env = oe
  })
})
