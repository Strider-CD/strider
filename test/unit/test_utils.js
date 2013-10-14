var _ = require('underscore')
  , utils = require('../../lib/utils')
  , expect = require('chai').expect
  , fs = require('fs')
  , path = require('path')

describe('utils', function () {
  describe('.defaultSchema', function () {
    it('should cover a complex case', function () {
      expect(utils.defaultSchema({
        runtime: {
          type: String,
          enum: ['0.6', '0.8', '0.10', '0.11', 'stable', 'latest', 'whatever'],
          default: 'whatever'
        },
        test: { type: String, default: 'npm test' }
      })).to.eql({
        runtime: 'whatever',
        test: 'npm test'
      });
    });
  });

  describe('validateAgainstSchema', function () {
    it('should cover a complex case', function () {
      expect(utils.validateAgainstSchema({
        unknown: 'key',
        runtime: 'latest',
        test: 'things',
        noCheck: {
          nexted: 23
        }
      }, {
        runtime: {
          type: String,
          enum: ['0.6', '0.8', '0.10', '0.11', 'stable', 'latest', 'whatever'],
          default: 'whatever'
        },
        test: { type: String, default: 'npm test' },
        noCheck: {}
      })).to.eql({
        runtime: 'latest',
        test: 'things',
        noCheck: {
          nexted: 23
        }
      })
    })
  })
        
});

