
var chai = require("chai")
  , chaiAsPromised = require("chai-as-promised")
  , wd = require('wd')

chai.use(chaiAsPromised)
chai.should()
chaiAsPromised.transferPromiseness = wd.transferPromiseness

module.exports = function (b, done) {
  b.rel('/')
    .comment('Login')
      .elementByName('email')
      .type('test2@example.com')
      .elementByName('password')
      .type('test')
      .elementById('navbar-signin-form')
      .submit()
      .elementByClassName('logged-in')
      .isVisible()
    .comment('Project listing')
      .elementsByCssSelector('[data-test="latest-build"]', function (err, items) {
        expect(items.length).to.be.moreThan(0)
      })
    .comment('Build page')
      .rel('/strider-cd/test-node')
      .elementByCssSelector('#build-metadata [data-test="job-id"]')
      .text().should.become('529568ed')
      .comment('Switch builds')
        .elementByCssSelector('#list-of-builds .build-list-item:nth-child(2)')
        .click()
        .elementByCssSelector('#build-metadata [data-test="job-id"]')
        .text().should.become('529568e6')
    .fail(function (err) {
      console.log('ERROR: ' + err.message)
      console.log(err.stack)
      done(err)
    })
    .fin(function () {
      b.quit(function () {
        done(null)
      })
    })
    .done()
}

