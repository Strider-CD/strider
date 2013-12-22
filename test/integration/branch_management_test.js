module.exports = function (browser, callback) {
  describe('Branch Management', function () {

    it('should show the branch management panel', function () {
      return browser.rel('/')
        .elementByName('email')
        .type('test2@example.com')
        .elementByName('password')
        .type('test')
        .elementById('navbar-signin-form')
        .submit()
        .waitForElementByClassName('logged-in')
        .rel('/strider-cd/test-node/config')
        .waitForElementByCssSelector('#project_config_branches')
        .isDisplayed()
    })

    it('should add a new branch to be watched', function () {
      return browser.rel('/strider-cd/test-node/config')
        .elementByName('name')
        .type('feature/*')
        .elementByCssSelector('#project_config_branches form button')
        .click()
        .waitForElementByCssSelector('.message')
        .elementsByCssSelector('.branch-item')
        .then(function (items) {
          items.length.should.equal(2, 'number of items in branch panel list')
        })
        .elementsByCssSelector('.branch-picker select option')
        .then(function (items) {
          items.length.should.equal(2, 'number of items in branch select')
        })
    })

    it('should have persisted new branch', function () {
      return browser.rel('/strider-cd/test-node/config')
        .waitForElementByCssSelector('.branch-item')
        .elementsByCssSelector('.branch-item')
        .then(function (items) {
          items.length.should.equal(2, 'number of items in branch panel list')
        })
        .elementsByCssSelector('.branch-picker select option')
        .then(function (items) {
          items.length.should.equal(2, 'number of items in branch select')
        })
    })

    after(function () {
      return browser.quit(function () {
        callback()
      })
    })

  })
}