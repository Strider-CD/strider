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
      })
    })
  })

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

  describe('.mergePlugins', function () {
    it('should work for nulls', function () {
      expect(utils.mergePlugins(null, null)).to.equal(null)
      expect(utils.mergePlugins([], null)).to.eql([])
      expect(utils.mergePlugins(null, [])).to.eql([])
    })

    it('should collect plugins', function () {
      expect(utils.mergePlugins([
        {id: 'one', config: {one: 1}},
        {id: 'two', config: {two: 2}}
      ], [
        {id: 'three', config: {three: 3}},
        {id: 'four', config: {four: 4}}
      ])).to.eql([
        {id: 'three', config: {three: 3}},
        {id: 'four', config: {four: 4}},
        {id: 'one', config: {one: 1}},
        {id: 'two', config: {two: 2}}
      ])
    })

    it('should collect and overwrite', function () {
      expect(utils.mergePlugins([
        {id: 'three', config: {one: 1, three: 4}},
        {id: 'two', config: {two: 2}}
      ], [
        {id: 'three', config: {three: 3}},
        {id: 'four', config: {four: 4}}
      ])).to.eql([
        {id: 'three', config: {three: 3}},
        {id: 'four', config: {four: 4}},
        {id: 'two', config: {two: 2}}
      ])
    })
  })
});

