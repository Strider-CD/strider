module.exports = function (browser, callback) {

  describe('Github Integration', function () {

    it('should link account with github', function () {
      return browser.rel('/')
        .elementByName('email')
        .type('test1@example.com')
        .elementByName('password')
        .type('open-sesame')
        .elementById("navbar-signin-form")
        .submit()
        .elementByClassName('provider-github')
        .click()
        .waitForElementByClassName('octicon-logo-github', 6000)
        .isDisplayed()
        .elementByName('login')
        .type('strider-test-robot')
        .elementByName('password')
        .type("i0CheCtzY0yv4WP2o")
        .elementByName('commit')
        .click()
        .waitForElementByClassName('StriderBlock_Brand', 6000)
        .isDisplayed()
    })

    it('should create a project from github and run its first test', function () {
      return browser.rel('/projects')
        .elementByClassName('add-repo')
        .click()
        .elementByCssSelector('.project-type.btn')
        .click()
        .waitForElementByCssSelector('.btn-success', 5000)
        .click()
        .waitForElementByLinkText('Click to watch it run', 3000)
        .click()
        .waitForElementByCssSelector('.job-repo', 2000)
        .url().should.eventually.include('strider-test-robot/strider-extension-loader')
    })

    after(function () {
      return browser.quit(function () {
        callback()
      })
    })

  })

}

