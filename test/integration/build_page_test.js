module.exports = function (browser, callback) {
  describe('the Build Page', function () {

    it('should show the project listing page', function () {
      return browser.rel('/')
        .elementByName('email')
        .type('test2@example.com')
        .elementByName('password')
        .type('test')
        .elementById('navbar-signin-form')
        .submit()
        .elementsByCssSelector('[data-test="latest-build"]')
        .then(function (items) {
          items.length.should.equal(1)
        })
    })

    it('should show the build page', function () {
      return browser.rel('/strider-cd/test-node')
        .elementByCssSelector('#build-metadata [data-test="job-id"]')
        .text().should.become('529568ed')
    })

    it('should correctly switch between builds', function () {
      return browser.rel('/strider-cd/test-node')
        .elementByCssSelector('#list-of-builds .build-list-item:nth-child(2)')
        .click()
        .elementByCssSelector('#build-metadata [data-test="job-id"]')
        .text().should.become('529568e6')
    })

    after(function () {
      return browser.quit(function () {
        callback()
      })
    })

  })
}