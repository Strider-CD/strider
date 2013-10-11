var  _ = require('underscore')
  , Step = require('step')
  , assert = require('assert')
  , fs = require('fs')
  , heroku = require('../lib/heroku')
  , mockrequest = require('mock-request')
  , models = require('../lib/models')
  , sandboxed_module = require('sandboxed-module')
  , should = require('should')
  , sinon = require('sinon')
  , ssh = require('../lib/ssh')
  ;


// You need to put a key here for integration tests
var TEST_USER_API_KEY = "";

describe('heroku', function() {

  // Integration tests.
  xdescribe('#api_call()', function() {

    it('should be able to fetch list of apps', function(done) {
      this.timeout(20000);
      heroku.api_call('/apps', TEST_USER_API_KEY, function(e, r, b) {
        r.statusCode.should.eql(200);
        var apps;
        (function() {
          apps = JSON.parse(b);
        }).should.not.throw();
        done();
      });
    });

    it('should be able to create and delete apps', function(done) {
      this.timeout(40000);
      var app_name = "bf-testapp-" + Math.floor(Math.random() * 1024 * 1024) 
      var app_stack = "cedar";
      Step(
        // Create a new app
        function createApp() {
          heroku.api_call('/apps', TEST_USER_API_KEY, this,
            {"app[name]":app_name,"app[stack]":app_stack}, "POST");
        },
        // Verify response & issue DELETE
        function deleteApp(e, r, b) {
          if (e) throw e;
          r.statusCode.should.eql(202);
          var app;
          (function() {
            app = JSON.parse(b);
          }).should.not.throw();
          app.name.should.eql(app_name);
          heroku.api_call('/apps/' + app_name, TEST_USER_API_KEY, this, {}, "DELETE");
        },
        // Verify response & issue GET
        function listApps(e, r, b) {
          if (e) throw e;
          assert(!e);
          r.statusCode.should.eql(200);
          (function() {
            var apps = JSON.parse(b);
          }).should.not.throw();
          heroku.api_call('/apps', TEST_USER_API_KEY, this);
        },
        // Verify testapp is not present in app list
        function verifyDeleted(e, r, b) {
          if (e) throw e;
          r.statusCode.should.eql(200);
          var apps;
          (function() {
            apps = JSON.parse(b);
          }).should.not.throw();
          var app_names = _.pluck(apps, "name");
          var app_found = _.find(app_names, function(item) {
              return item === app_name;

          });
          assert.strictEqual(app_found, undefined);
          done();
        }
      );
    });
  });

  // Integration tests.
  xdescribe("#add_ssh_key()", function() {

    it('should correctly add, list and delete the SSH key', function(done) {
      this.timeout(40000);
      var keyname = "/tmp/heroku-test-key" + Math.floor(Math.random() * 1024 * 1024);
      var user_host_field;
      var ghLogin = "testUser";
      var pubkey;

      Step(
        // Create keypair
        function() {
          ssh.generate_keypair(ghLogin, keyname, this);
        },
        function(code) {
          code.should.eql(0);
          fs.readFile(keyname, 'utf8', this.parallel());
          fs.readFile(keyname + ".pub", 'utf8', this.parallel());
        },
        // Add keypair to Heroku account
        function(err, privkey, pubkey) {
          if (err) throw err;
          this.pubkey = pubkey;
          user_host_field = pubkey.split(' ')[2].trim();
          heroku.add_ssh_key(TEST_USER_API_KEY, pubkey, this);
        },
        // List keypairs
        function(e, r, b) {
          if (e) throw e;
          r.statusCode.should.eql(200);
          heroku.list_ssh_keys(TEST_USER_API_KEY, this);
        },
        // Verify created keypair present in Heroku
        // Then delete created keypair
        function(e, r, b) {
          if (e) throw e;
          var keys;
          (function() {
            keys = JSON.parse(b);
          }).should.not.throw();

          var added_key = _.find(keys, function(item) {
            var item_user_host = item.contents.split(' ')[2].trim();
            return (item_user_host === user_host_field);
          });
          added_key.contents.should.eql(this.pubkey.trim());

          heroku.delete_ssh_key(TEST_USER_API_KEY, user_host_field, this);
        },
        // Verify keypair deleted from Heroku
        function(e, r, b) {
          if (e) throw e;
          r.statusCode.should.eql(200);
          heroku.list_ssh_keys(TEST_USER_API_KEY, this);
        },
        function(e, r, b) {
          if (e) throw e;
          r.statusCode.should.eql(200);
          var keys;
          (function() {
            keys = JSON.parse(b);
          }).should.not.throw();
          var added_key = _.find(keys, function(item) {
            return (item.contents.split(' ')[2].trim() === user_host_field);
          });
          assert.strictEqual(added_key, undefined);
          done();
        }
      );
    });
  });

  // Mocked integration test.
  describe("#setup_account_integration()", function() {
    it('should correctly set the SSH key and persist details in the user object', function(done) {
      this.timeout(20000);
      var user_obj = {github:{login:"testUser"}, heroku: [], save: function(cb) {cb(null, this)}};
      var monkey_request = mockrequest.mock({
        protocol: "https",
        host: "api.heroku.com"
      })
        .post('/user/keys?')
        .respond(200)
        .run();
      var heroku = sandboxed_module.require('../lib/heroku.js', {
        requires: {'request':monkey_request}
      });

      heroku.setup_account_integration(user_obj, TEST_USER_API_KEY, function(err, user_obj) {
        user_obj.heroku[0].api_key.should.eql(TEST_USER_API_KEY);
        user_obj.heroku[0].pubkey.length.should.be.above(0);
        user_obj.heroku[0].privkey.length.should.be.above(0);
        user_obj.heroku[0].account_id.should.match(/^.*@.*$/);
        done();
      });
    });

  });

  // Mocked integration test.
  describe("#setup_delivery_integration()", function() {
    it('should correctly set the SSH key and persist details in the user object', function(done) {
      this.timeout(5000);
      var account_id = "test@beyondfog.com";
      var repo_url = "https://github.com/beyondfog/test";
      var app = "BFTEST";
      var user_obj = {
        github_config: [
            {url: "bah"
            , prod_deploy_target: {}
            }
          , {
              url: repo_url
            , prod_deploy_target: {}
          }
        ]
        , heroku: [
            { account_id: "BAD" }
          , {
              account_id: account_id
            , app: app,
          }
        ]
        , save: function(cb) {cb(null, this)}
      };
      user_obj.get_repo_config = _.bind(models.UserSchema.methods.get_repo_config, user_obj);

      heroku.setup_delivery_integration(user_obj, account_id, repo_url, app, function(err, user_obj) {
        user_obj.github_config[1].prod_deploy_target.provider.should.eql("heroku");
        user_obj.github_config[1].prod_deploy_target.account_id.should.eql(account_id);
        user_obj.heroku[1].app.should.eql(app);
        done();
      });
    });

  });
});
