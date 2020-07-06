
var expect = require('expect.js'),
  sm = require('mocha-selenium'),
  b = sm.setup('views:Config', {
    appCmd: 'node test/strider.js',
    lastShot: 'failed'
  });

// todo: test the "live update"
//       and unknown job, and 
//       job kickoff
describe('config page', function () {
  this.timeout(30 * 1000);
  describe('default fixture', function () {
    before(function (done) {
      b.rel('/testorg/testrepo/config?test=none', done);
    });

    it('should display public checked', function (done) {
      b.attrByCss('[data-test="public"]', 'checked', function (err, value) {
        expect(value).to.equal('true');
        done();
      });
    });

    it('webhooks tab should be visible', function (done) {
      b.visibleByCss('[href="#plugin-webhooks"]', function (err, visible) {
        expect(visible).to.equal(true);
        done();
      });
    });

    describe('with branch tab selected', function () {
      before(function (done) {
        b.clickById('basic-tab-handle', done);
      });

      it('should display active checked', function (done) {
        b.attrByCss('[data-test="active"]', 'checked', function (err, value) {
          expect(value).to.equal('true');
          done();
        });
      });
    });

    describe('with plugins tab selected', function () {
      before(function (done) {
        b.clickByCss('[href="#tab-plugins"]', done);
      });

      it('should list plugins in use', function (done) {
        b.elementsByCss('.enabled-plugins .plugin-item', function (err, elements) {
          expect(elements.length).to.equal(1);
          done();
        });
      });
      
      it('should list plugins not in use', function (done) {
        b.elementsByCss('.disabled-plugins .plugin-item', function (err, elements) {
          expect(elements.length).to.equal(4);
          done();
        });
      });
    });
  });
});
      

