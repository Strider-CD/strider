var _ = require('underscore')
  , filter = require('../lib/ansi')
  , expect = require('chai').expect
  , fs = require('fs')
  , path = require('path')
  ;

function loadFix(name) {
  return fs.readFileSync(path.join(__dirname, 'fixtures', 'ansi-' + name)).toString('utf8');
}

describe('ansi filtering', function () {
  it('should work w/ mocha output', function () {
    expect(filter(loadFix('1.in'))).to.equal(loadFix('1.out'));
  });
  it('should strip correctly', function () {
    expect(filter(loadFix('2.in'), true)).to.equal(loadFix('2.out'));
  });
})
