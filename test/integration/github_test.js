var deleteHooks = require('strider-github/lib/api').deleteHooks

module.exports = function (browser, callback) {

  describe('Github Integration', function () {
    var robot = {
      username: 'strider-test-robot',
      password: 'i0CheCtzY0yv4WP2o',
      repo: 'strider-extension-loader',
      token: 'df24805561a32092b24fe274136c299e842d5fcf'
    }

    before(function(done) {
      var url = 'http://localhost:4000/'+robot.username+'/'+robot.repo+'/api/github/webhook'
      var repo = robot.username+'/'+robot.repo
      deleteHooks(repo, url, robot.token, done)
    })

    beforeEach(function() {
      this.currentTest.browser = browser;
    });

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
        .type(robot.username)
        .elementByName('password')
        .type(robot.password)
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
        .url().should.eventually.include(robot.username+'/'+robot.repo)
    })

    after(function () {
      return browser.quit(function () {
        callback()
      })
    })

  })
}
