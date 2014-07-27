var _ = require('lodash')
  , expect = require('chai').expect
  , lconf = require('../../lib/libconfig.js')
  , sinon = require('sinon')

describe('config', function () {

  describe('camel', function () {
    it('should convert to camelCase', function () {
      expect(lconf.camel(['one', 'two', 'three'])).to.equal('oneTwoThree')
    })
  })

  describe('.addPlugins', function () {

    it('should parse JSON', function () {
      var rc = {}
        , gc = {appId: 'theid', appSecret: 'the Secret', port: 3000, hostname: 'mensch'}
        , bc = {one: 2, three: 'four'}
      lconf.addPlugins(rc, {
        PLUGIN_GITHUB: JSON.stringify(gc),
        PLUGIN_BITBUCKET: JSON.stringify(bc)
      })
      expect(rc.plugins).to.eql({
        github: gc,
        bitbucket: bc
      })
    })

    it('should ignore invalid JSON', function () {
      sinon.stub(console, 'warn')
      var rc = {}
        , gc = {appId: 'theid', appSecret: 'the Secret', port: 3000, hostname: 'mensch'}
      lconf.addPlugins(rc, {
        PLUGIN_GITHUB: JSON.stringify(gc),
        PLUGIN_BITBUCKET: 'not valid json'
      })
      expect(console.warn.callCount).to.eq(1);
      expect(rc.plugins).to.eql({
        github: gc
      })
      console.warn.restore();
    })

    it('should get individual variables', function () {
      var rc = {}
      lconf.addPlugins(rc, {
        PLUGIN_GITHUB_APP_ID: 4,
        PLUGIN_GITHUB_HOSTNAME: 'us',
        PLUGIN_BITBUCKET_SECRET_KEY: 'dontlook'
      })
      expect(rc.plugins).to.eql({
        github: {
          appId: 4,
          hostname: 'us'
        },
        bitbucket: {
          secretKey: 'dontlook'
        }
      })
    })
  })

  it('should arrange the smtp config', function () {
    var oe = process.env
      , config
    process.env = _.extend({}, process.env, {
      SMTP_HOST: 'here',
      SMTP_PORT: 777,
      SMTP_USER: 'me',
      SMTP_PASS: 'mine',
      SMTP_FROM: 'me@example.com'
    })
    config = lconf.getConfig(true)
    expect(config.smtp).to.eql({
      host: 'here',
      port: 777,
      auth: {
        user: 'me',
        pass: 'mine'
      },
      from: 'me@example.com'
    })
    process.env = oe
  })

  it('should pick up legacy github variables', function () {
    sinon.stub(console, 'warn')
    var oe = process.env
      , config
    process.env = _.extend({}, process.env, {
      APP_ID: 'one',
      APP_SECRET: 'two'
    })
    config = lconf.getConfig()
    expect(config.plugins.github.appId).to.equal('one')
    expect(config.plugins.github.appSecret).to.equal('two')
    process.env = _.extend({}, oe, {
      GITHUB_APP_ID: 'one',
      GITHUB_SECRET: 'two'
    })
    config = lconf.getConfig()
    expect(config.plugins.github.appId).to.equal('one')
    expect(config.plugins.github.appSecret).to.equal('two')
    expect(console.warn.callCount).to.eq(8);
    console.warn.restore();
  })

  it('should pick up non-prefixed items', function () {
    var oe = process.env
      , config
    process.env = _.extend({}, process.env, {
      PORT: 5001,
      SERVER_NAME: 'local',
      SESSION_SECRET: 'sec'
    })
    config = lconf.getConfig()
    expect(config.port).to.equal(5001)
    expect(config.server_name).to.equal('local')
    expect(config.session_secret).to.equal('sec')
    process.env = oe
  })
})
