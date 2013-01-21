var _ = require('underscore')
  , EventEmitter = require('events').EventEmitter
  , api = require('../routes/api/index.js')
  , api_account = require('../routes/api/account.js')
  , api_jobs = require('../routes/api/jobs.js')
  , common = require('../lib/common')
  , gh = require('../lib/github')
  , models = require('../lib/models')
  , request = require('request')
  , sandboxed_module = require('sandboxed-module')
  , should = require('should')
  , sinon = require('sinon')
  ;


describe('api', function() {
  describe('#github_metadata()', function() {
    it('should fetch metadata from github if not in cache', function() {
      var stub = sinon.sandbox.stub(gh, 'get_github_repos');
        // TODO
      sinon.sandbox.restore();
    });

  });
  describe('#jobs_start()', function() {
    it('should abort with 400 if repo not configured', function() {
      var test_url = "http://github.com/foo/testrepo";
      var test_obj = {
        url: test_url
      };
      var req = {user:{}, param:function(key) {return test_obj[key]}, github:{id:"123"}, github_metadata:{"123":{repos:[]}}};
      req.user.get_repo_config = function(url, cb) { return cb("none", null, undefined, undefined); };
      var res = {end:function() {}};
      var mock = sinon.sandbox.mock(res);
      mock.expects("end").once();

      api_jobs.jobs_start(req, res);
      res.statusCode.should.eql(400);
      mock.verify();
      mock.restore();
    });

  });
  describe('#account_password()', function() {
    it('should abort with 400 if password less than 6 chars long', function() {
      var req = {params:{password:"123"}, param:function(key) {return this.params[key]}};
      var res = {end:function() {}};
      api_account.account_password(req, res);

      res.statusCode.should.eql(400);

    });
    it('should set user password if valid', function(done) {
      var req = {
        params: {
          password:"123456"
        },
        param: function(key) {
          return this.params[key]
        },
      };
      req.user = {password:"BAD"};
      req.user.save = function() {
        req.user.password.should.eql(req.params.password);
        done();
      };
      var res = {end:function() {}};
      api_account.account_password(req, res);

    });

  });

  describe('#account_email()', function() {
    it('should abort with 400 if email is invalid', function() {
      var req = {params:{email:"t"}, param:function(key) {return this.params[key]}};
      var res = {end:function() {}};
      api_account.account_email(req, res);

      res.statusCode.should.eql(400);

    });
    it('should set user email if valid', function(done) {
      var req = {
        params: {
          email:"testemail@example.com"
        },
        param: function(key) {
          return this.params[key]
        },
      };
      req.user = {email:"BAD"};
      req.user.save = function() {
        req.user.email.should.eql(req.params.email);
        done();
      };
      var res = {end:function() {}};
      api_account.account_email(req, res);

    });

  });

});
