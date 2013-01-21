var assert = require('assert')
  , crypto = require('crypto')
  , fs = require('fs')
  , github = require('../lib/github')
  , path = require('path')
  , request = require('request')
  , should = require('should')
  , sinon = require('sinon')
  ;


describe('github', function() {

  describe('#parse_link_header()', function() {
    it('should throw exception on empty header', function() {
      (function() {
        github.parse_link_header("");
      }).should.throw();
    });

    it('should throw exception on section without ;', function() {
      (function() {
        github.parse_link_header("foo, bar");
      }).should.throw();
    });

    it('should correctly parse a valid link header', function() {

      var header = '<https://api.github.com/user/repos?access_token=foo&page=98&per_page=1>; rel="next", <https://api.github.com/user/repos?access_token=foo&page=98&per_page=1>; rel="last", <https://api.github.com/user/repos?access_token=foo&page=1&per_page=1>; rel="first", <https://api.github.com/user/repos?access_token=foo&page=96&per_page=1>; rel="prev"';

      var r = github.parse_link_header(header);

      r.prev.should.eql("https://api.github.com/user/repos?access_token=foo&page=96&per_page=1");
      r.last.should.eql("https://api.github.com/user/repos?access_token=foo&page=98&per_page=1");
      r.next.should.eql("https://api.github.com/user/repos?access_token=foo&page=98&per_page=1");
      r.first.should.eql("https://api.github.com/user/repos?access_token=foo&page=1&per_page=1");


    });


  });

  describe('#get_oauth2()', function() {
    it('should correctly build request URL w/ access token', function() {
      var mock = sinon.mock(request);
      var expect_url = "/user/repos?access_token=TEST_TOKEN";
      mock.expects("get").once().withArgs(expect_url);
      github.get_oauth2('/user/repos', {}, "TEST_TOKEN", null, request);
      mock.verify();
    });
    it('should correctly build request URL w/ access token and query params', function() {
      var mock = sinon.mock(request);
      var expect_url = "/user/repos?foo=bar&access_token=TEST_TOKEN";
      mock.expects("get").once().withArgs(expect_url);
      github.get_oauth2('/user/repos', {foo:"bar"}, "TEST_TOKEN", null, request);
      mock.verify();
    });
  });

  describe("#api_call()", function() {
    it('should parse the JSON data in the HTTP response', function() {
      var stub = sinon.sandbox.stub(request, 'get');
      var terror = null;
      var tresponse = {statusCode: 200};
      var tdata = {test: 'test'};
      stub.callsArgWith(1, terror, tresponse, JSON.stringify(tdata));
      var testcb = function(error, response, data) {
        response.should.eql(tresponse);
        data.should.eql(tdata);
      };
      github.api_call('/user/repo', 'TEST_TOKEN', testcb, stub);
      sinon.sandbox.restore();
    });
    it('should return null data on non-200 status code or other error', function() {
      var stub = sinon.sandbox.stub(request, 'get');
      var terror = null;
      var tresponse = {statusCode: 500};
      var tdata = {test: 'test'};
      stub.callsArgWith(1, terror, tresponse, JSON.stringify(tdata));
      var testcb = function(error, response, data) {
        assert(!error);
        response.should.eql(tresponse);
        assert(!data);
      };
      github.api_call('/user/repo', 'TEST_TOKEN', testcb, stub);
      terror = ["an error"];
      stub.callsArgWith(1, terror, tresponse, JSON.stringify(tdata));
      testcb = function(error, response, data) {
        error.should.eql(["an error"]);
        response.should.eql(tresponse);
        assert(!data);
      };
      github.api_call('/user/repo', 'TEST_TOKEN', testcb, stub);
      sinon.sandbox.restore();
    });
  });


  describe("#save_repo_deploy_keys()", function() {
    it('should handle non-existant github_config property and save the object', function() {
      var privkey = "privkey";
      var pubkey = "pubkey";
      var url = "https://foobar.com/blar";
      var user_obj = {save: function() {}, github_config: []};

      github.save_repo_deploy_keys(user_obj, url, privkey, pubkey, function(err, user) {
        user.github_config[0].privkey.should.eql(privkey);
        user.github_config[0].pubkey.should.eql(pubkey);
        user.github_config[0].secret.length.should.eql(44);
        user.github_config[0].url.length.should.eql(44);
      });

    });
  });


  describe("#add_deploy_key()", function() {
    it('should post key to Github endpoint', function() {
      var pubkey = "pubkey";
      var repo_id = 123;
      var repo_path = "/BeyondFog/test";
      var token = "TEST_TOKEN";
      var title = "test title";
      var mock_request = sinon.mock(request);
      var cb = function() {};
      mock_request.expects("post").once().withArgs({
        url:"https://api.github.com/repos/BeyondFog/test/keys?access_token="+token,
        body:{title: title, key: pubkey},
        json:true
      }, cb);
      github.add_deploy_key(repo_path, pubkey, title, token, cb, request);

      mock_request.verify();

      mock_request.restore();

    });
  });

  describe("#set_push_hook()", function() {
    it('should set Github push hook correctly', function() {
      var repo_id = 123;
      var repo_path = "/BeyondFog/test";
      var token = "TEST_TOKEN";
      var name = "Beyond Fog Test Hook";
      var hook_url ="http://strider.com/foo";
      var mock_request = sinon.mock(request);
      var secret = "TEST_SECRET";
      var cb = function() {};
      mock_request.expects("post").once().withArgs({
        url:"https://api.github.com/repos/BeyondFog/test/hooks?access_token="+token,
        body:{name: name, active: true, config: {url: hook_url, secret:secret}},
        json:true
      }, cb);
      github.set_push_hook(repo_path, name, hook_url, secret, token, cb, request);

      mock_request.verify();

      mock_request.restore();

    });
  });

  describe("#generate_webhook_secret()", function() {
    it('should return a 44-character string of random data', function(done) {
      github.generate_webhook_secret(function(data) {
        data.length.should.eql(64);
        done()
      });
    });
  });

  describe("#verify_webhook_sig()", function() {
    it('should correctly verify HMAC-SHA1 signatures', function(done) {
      github.generate_webhook_secret(function(secret) {
        var body = "a test webhook body";
        var hmac = crypto.createHmac('sha1', secret);
        hmac.update(body);
        var signature = hmac.digest('hex');

        github.verify_webhook_sig(signature, secret, body).should.eql(true);
        github.verify_webhook_sig(signature, secret, "bad body").should.eql(false);

        done();
      });
    });
  });


  describe('#webhook_extract_latest_commit_info', function() {
    it('should return the correct info from a webhook payload', function() {
      var payload = {
        after: "abcdef",
        commits: [
          {
            author: {
              name: "test1",
              email: "test1@example.com"
            },
            id: "badid",
            message: "this is a test commit message",
            timestamp: "2012-03-06T13:27.001Z"
          },
          {
            author: {
              name: "test2",
              email: "test2@example.com"
            },
            id: "abcdef",
            message: "this is a test commit message 2",
            timestamp: "2012-04-06T13:27.001Z"
          },
        ]
      };
      var extracted = github.webhook_extract_latest_commit_info(payload);
      extracted.id.should.eql(payload.after);
      extracted.message.should.eql(payload.commits[1].message);
      extracted.timestamp.should.eql(payload.commits[1].timestamp);
      extracted.author.should.eql(payload.commits[1].author);
    });
  });

  describe("#parse_github_url", function() {
    it("should correctly handle hyphens in URL", function() {
      var url = "https://github.com/niallo/strider-python-mongodb-test";

      var p = github.parse_github_url(url);

      p.org.should.eql("niallo");
      p.repo.should.eql("strider-python-mongodb-test");

    });

    it("should correctly handle periods (.) in URL", function() {
      var url = "https://github.com/niallo/apres.github.com";

      var p = github.parse_github_url(url);

      p.org.should.eql("niallo");
      p.repo.should.eql("apres.github.com");
    });

    it("should handle URL starting with http://", function() {
      var url = "http://github.com/BeyondFog/Strider";

      var p = github.parse_github_url(url);

      p.org.should.eql("BeyondFog");
      p.repo.should.eql("Strider");
    });

    it("should handle URL starting with github.com", function() {
      var url = "github.com/BeyondFog/Strider";

      var p = github.parse_github_url(url);

      p.org.should.eql("BeyondFog");
      p.repo.should.eql("Strider");
    });
    it("should correctly handle regular URL", function() {
      var url = "https://github.com/BeyondFog/Strider";

      var p = github.parse_github_url(url);

      p.org.should.eql("BeyondFog");
      p.repo.should.eql("Strider");
    });
    it("should return null if not a valid github URL", function() {
      var url = "/BeyondFog/Strider";
      var p = github.parse_github_url(url);
      should.not.exist(p);
    });

    it("should trim .git suffix from URLs", function() {
      var url = "https://github.com/niallo/gh-markdown-cli.git";
      var p = github.parse_github_url(url);

      p.repo.should.eql("gh-markdown-cli");


    });

  });

  describe("#make_ssh_url", function() {
    it("should create the correct url", function() {

      var url = github.make_ssh_url("niallo", "unworkable");

      should.exist(url);
      url.should.eql("git@github.com:niallo/unworkable.git");

    });
  });


});
