
var expect = require('expect.js');
var utils = require('../lib/utils');

describe('utils', function () {
  describe('exitError', function () {
    it('should return a subclass of error', function () {
      expect(utils.exitError('ls', 27)).to.be.an(Error);
    });
    it('should have a "code" attribute indicating the exit code', function () {
      expect(utils.exitError('ls', 27).code).to.equal(27);
    });
  });

  describe('sum', function () {
    it('should calculate correctly', function () {
      expect(utils.sum([12,3,4])).to.equal(19);
    });
  });

  describe('runPlugin', function () {
    describe('with no action for that phase', function () {
      var plugin = {};
      it('should noop', function (done) {
        utils.runPlugin('test', plugin, {}, done);
      });
    });
    describe('with a string action', function () {
      it('should call context.cmd', function (done) {
        utils.runPlugin('test', {'test': 'ls'}, {
          cmd: function (text) {
            expect(text).to.equal('ls');
            done();
          }
        }, null);
      });
    });
    describe('with an executable action', function () {
      it('should call the action', function (done) {
        utils.runPlugin('test', {
          test: function () {
            done();
          }
        }, {}, null);
      });
    });
  });

  describe('normalizeCmd', function () {
    it('should process a string', function () {
      var cmd = utils.normalizeCmd('ls -l -a');
      expect(cmd.command).to.equal('ls');
      expect(cmd.args).to.eql(['-l', '-a']);
    });

    it('should process a command and args', function () {
      var cmd = utils.normalizeCmd({command: 'ls', args: ['-a']});
      expect(cmd.command).to.equal('ls');
      expect(cmd.args).to.eql(['-a']);
    });
  });
});

