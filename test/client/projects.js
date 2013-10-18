
var expect = require('expect.js')
  , sm = require('mocha-selenium')
  , b = sm.setup('views:Projects', {
      appCmd: 'make serve-test',
      lastShot: 'failed'
    })

  , client = require('./client')

describe('projects', function () {
  this.timeout(30 * 1000)
  describe('with mock data', function () {
    before(function (done) {
      b.rel('/projects?test', done)
    })

    it('should list the number of enabled repos', function (done) {
      b.textByCss('[href="#group-github-1111-strider-cd"] .label', function (err, text) {
        expect(text).to.equal('1')
        done(err)
      })
    })
  })
})
