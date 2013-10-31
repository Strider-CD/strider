var _ = require('underscore')
  , utils = require('../../lib/tools')
  , expect = require('chai').expect
  , fs = require('fs')
  , path = require('path')

describe('tools', function () {

  describe('.pluginEnv', function () {
    it('should find and parse an env with multiple plugin configs', function () {
      var e = {
        STRIDER_ONE: false,
        STRIDER_P_GITHUB_APP_ID: 'theid',
        STRIDER_P_GITHUB_HOSTNAME: 'google.com',
        STRIDER_P_BITBUCKET_ID: 'bbt',
        STRIDER_P_HEROKU_ID: 'yeahaa'
      }
      expect(utils.pluginEnv(e)).to.eql({
        github: {
          appId: 'theid',
          hostname: 'google.com'
        },
        bitbucket: {
          id: 'bbt'
        },
        heroku: {
          id: 'yeahaa'
        }
      })
    })
  })
  
})
