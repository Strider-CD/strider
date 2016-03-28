'use strict';

var assert = require('chai').assert

module.exports = function (browser, callback) {
  describe('Login', function () {
    beforeEach(function () {
      this.currentTest.browser = browser;
    });

    it('should be visible', function () {
      return browser.rel('/')
        .waitForElementByCssSelector('a.brand')
        .isDisplayed();
    });

    it('should fail with invalid credentials', function () {
      return browser.rel('/')
        .elementByName('email')
        .type('test1@example.com')
        .elementByName('password')
        .type('BAD CREDS')
        .submit()
        .url().should.eventually.include('?failed=true');
    });

    it('should have a forgotten password page', function () {
      return browser.rel('/')
        .elementById('forgot-password-link')
        .click()
        .url().should.eventually.include('/forgot');
    });

    it('should show forgotten password success page', function () {
      return browser.rel('/forgot')
        .elementByCss('form[action="/forgot"] [name=email]')
        .type('test1@example.com')
        .elementByClassName('primary')
        .click()
        .elementByClassName('alert-info')
        .then(function (element) {
          assert.isNotNull(element);
        });
    });

    it('should work with valid credentials', function () {
      return browser.rel('/')
        .elementByName('email')
        .type('test1@example.com')
        .elementByName('password')
        .type('open-sesame')
        .elementByClassName('login-form')
        .submit()
        .elementByClassName('no-projects')
        .then(function (element) {
          assert.isNotNull(element);
        });
    });

    it('should log out', function () {
      return browser.rel('/logout')
        .waitForElementByClassName('login-form')
        .isDisplayed()
    })

    it('should redirect to /login and back', function () {
      return browser.rel('/strider-cd/test-node')
        .url().should.eventually.include('/login')
        .elementByName('email')
        .type('test2@example.com')
        .elementByName('password')
        .type('test')
        .elementByClassName('login-form')
        .submit()
        .url().should.eventually.include('/strider-cd/test-node')
        .elementById('build-metadata')
        .then(function (element) {
          assert.isNotNull(element);
        });
    })

    after(function () {
      return browser.quit(function () {
        callback();
      });
    });
  });
};
