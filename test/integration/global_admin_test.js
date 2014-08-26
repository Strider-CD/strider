var assert = require('chai').assert

module.exports = function (browser, callback) {

  describe('global admins', function () {

    beforeEach(function() {
      this.currentTest.browser = browser;
    });

    it('should be able to see all projects', function () {
      return browser.rel('/')
        .elementByName('email')
        .type('test4@example.com')
        .elementByName('password')
        .type('password2')
        .elementById('navbar-signin-form')
        .submit()
        .elementsByCssSelector('[data-test="latest-build"]')
        .then(function (items) {
          items.length.should.equal(1)
        })
    })

    it('should be able to see the build actions on the build page', function () {
      return browser.rel('/strider-cd/test-node')
        .elementByCssSelector('.test-and-deploy-action')
        .then(function (element) {
          assert.isNotNull(element)
        })
        .elementByCssSelector('.test-only-action')
        .then(function (element) {
          assert.isNotNull(element)
        })
        .elementByCssSelector('.job-title h3 a')
        .then(function (element) {
          assert.isNotNull(element)
        })
        .fail(function(error) {
          console.log(error)
        })
    })

    it('should not be able to see all projects when not a global admin', function () {
      return browser.rel('/')
        .elementByCssSelector('.logged-in a')
        .click()
        .waitForElementByName('email')
        .type('test5@example.com')
        .elementByName('password')
        .type('password3')
        .elementById('navbar-signin-form')
        .submit()
        .elementsByCssSelector('[data-test="latest-build"]')
        .then(function (items) {
          items.length.should.equal(0)
        })
    })

    after(function () {
      return browser.quit(function () {
        callback()
      })
    })

  })

}