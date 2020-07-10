var expect = require('expect.js');
var colorize = require('../lib/colorize');

describe('colorize', function () {
  var message = 'hello strider';
  Object.keys(colorize).forEach(function (name) {
    describe(name, function () {
      it('should return a string that contains the original message', function () {
        expect(colorize[name](message)).to.contain(message);
      });
    });
  });
});
