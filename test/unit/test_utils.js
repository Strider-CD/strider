var _ = require('underscore')
  , utils = require('../../lib/utils')
  , expect = require('chai').expect
  , fs = require('fs')
  , path = require('path')

describe('utils', function () {

  describe('defaultSchema()', function () {

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

  describe('validateAgainstSchema()', function () {

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

  describe('mergePlugins()', function () {

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

  describe('findBranch()', function () {

    var branches =
      [ { name: 'test' }
      , { name: 'test*test' }
      , { name: 'test*' }
      , { name: '*test' }
      , { name: '*test*' }
      , { name: '*' }
      ]

    it('should find a branch with no wildcards', function () {
      var branch = utils.findBranch(branches, 'test')
      expect(branch.name).to.equal('test')
    })

    it('should find a branch with wildcard at end', function () {
      var branch = utils.findBranch(branches, 'test*')
      expect(branch.name).to.equal('test*')
    })

    it('should find a branch with wildcard at start', function () {
      var branch = utils.findBranch(branches, '*test')
      expect(branch.name).to.equal('*test')
    })

    it('should find a branch with wildcard at start and end', function () {
      var branch = utils.findBranch(branches, '*test*')
      expect(branch.name).to.equal('*test*')
    })

    it('should find a branch with wildcard in middle', function () {
      var branch = utils.findBranch(branches, 'test*test')
      expect(branch.name).to.equal('test*test')
    })

    it('should find a branch with only wildcard', function () {
      var branch = utils.findBranch(branches, '*')
      expect(branch.name).to.equal('*')
    })

    it('should match wildcard in middle branch', function () {
      var branch = utils.findBranch(branches, 'testingtest')
      expect(branch.name).to.equal('test*test')
    })

    it('should match wildcard at end branch', function () {
      var branch = utils.findBranch(branches, 'testing')
      expect(branch.name).to.equal('test*')
    })

    it('should match wildcard at start branch', function () {
      var branch = utils.findBranch(branches, 'mytest')
      expect(branch.name).to.equal('*test')
    })

    it('should match wildcard at start and end branch', function () {
      var branch = utils.findBranch(branches, 'mytestingbranch')
      expect(branch.name).to.equal('*test*')
    })

    it('should match wildcard only branch', function () {
      var branch = utils.findBranch(branches, 'branch')
      expect(branch.name).to.equal('*')
    })

  })

})




// function test(string, against) {
//   var regEx = new RegExp('^' + string.replace(/\*/g, '.*') + '$')
//   return regEx.test(against)
// }

// console.log('true:')
// console.log('* : master', test('*', 'master'))
// console.log('master : master', test('master', 'master'))
// console.log('master* : master', test('master*', 'master'))
// console.log('*master : master', test('*master', 'master'))
// console.log('master* : mastered', test('master*', 'mastered'))
// console.log('*master : testmaster', test('*master', 'testmaster'))
// console.log('*master* : testmastered', test('*master*', 'testmastered'))
// console.log('feature/* : feature/my-new-feature', test('feature/*', 'feature/my-new-feature'))
// console.log('feature/* : feature/', test('feature/*', 'feature/'))
// console.log('feature/* : feature/', test('feature/*', 'feature/'))

// console.log('false:')
// console.log('master* : test', test('master*', 'test'))
// console.log('*master : test', test('*master', 'test'))
// console.log('master* : test', test('master*', 'test'))
// console.log('feature/ : feature/my-new-feature', test('feature/', 'feature/my-new-feature'))
// console.log('test : testing', test('test', 'testing'))

