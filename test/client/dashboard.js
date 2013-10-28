
var expect = require('expect.js')
  , sm = require('mocha-selenium')
  , b = sm.setup('views:Dashboard', {
      appCmd: 'node test/strider.js',
      lastShot: 'failed'
    })

// todo: test the "live update"
//       and unknown job, and 
//       job kickoff
describe('dashboard', function () {
  this.timeout(30 * 1000)
  describe('with no jobs', function () {
    before(function (done) {
      b.rel('/?test=none', done)
    })

    it('should show the button to setup jobs manually', function (done) {
      b.visibleByCss('.alert a.btn[href="/projects#manual"]', function (err, displayed, el) {
        expect(displayed).to.be.ok()
        done(err)
      })
    })
  })

  describe('with only public jobs and two provider plugins', function () {
    before(function (done) {
      b.rel('/?test=public', done)
    })

    it('should show the no-jobs alert', function (done) {
      b.visibleByCss('[data-test="no-personal-projects"]', function (err, visible) {
        expect(visible).to.be.ok()
        done()
      })
    })

    it('should link to setup providers', function (done) {
      b.elementsByCss('[data-test="no-personal-projects"] .link-accounts a.btn', function (err, els) {
        expect(els.length).to.be.ok()
        done(err)
      })
    })
  })
})
