var assert = require('assert')
  , common = require('../lib/common')
  , EventEmitter = require('events').EventEmitter
  , index = require('../routes')
  , gh = require('../lib/github')
  , sandboxed_module = require('sandboxed-module')
  , should = require('should')
  , sinon = require('sinon')
  ;


describe('index', function() {
  describe('#kickoff()', function() {
    it('should error with 400 if no metadata cache', function() {
      var mock_req = {user: {}};
      var response_api = {end: function() {}};
      var mock = sinon.mock(response_api).expects("end").once().withArgs("please call /api/github/metadata before this");
      index.kickoff(mock_req, response_api);
      mock.verify();
      response_api.statusCode.should.eql(400);
    });

  });

  describe('#webhook()', function() {
    it('should only fire if commit is to master', function() {
      common.emitter = new EventEmitter();
      var mock_req = {user: {}};
      var response_api = {end: function() {}};
      var mock_user = {github:{id:"123"}, github_metadata:{"123":{repos:[]}}};
      var mock_payload = {"ref":"refs/heads/master"}
      var mock_repo = {has_prod_deploy_target: false, collaborators:[], display_url:"https://github.com/foo/bar"};
      var jobs_api = {startJob: function(user, repo, deploy_config, repo_ssh_url) {}};
      common.emitter.once('queue.new_task', function(data) {
        zmq_api.new_test_task(data.user,
            data.repo_config,
            data.deploy_config,
            data.github_commit_info,
            data.repo_ssh_url);
      });
      var mock_jobs = sinon.mock(jobs_api).expects("startJob").once().withArgs(mock_user, mock_repo);
      var gh_api = {
        verify_webhook_req_signature: function(req, callback) {
            callback(true, mock_repo, mock_user, mock_payload);
        },
        webhook_commit_is_to_master:gh.webhook_commit_is_to_master,
        webhook_extract_latest_commit_info:function() {},
        make_ssh_url:gh.make_ssh_url,
        parse_github_url:gh.parse_github_url
      };
      var index = sandboxed_module.require('../routes', {
        requires: {'../lib/jobs':jobs_api, '../lib/github':gh_api, '../lib/common':common }
      });
      index.webhook_signature(mock_req, response_api);
      mock_jobs.verify();
    });

  });


});
