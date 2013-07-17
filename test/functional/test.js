var  _ = require('underscore')
  , app = require('../../lib/app')
  , models = require('../../lib/models')
  , assert = require('assert')
  , common = require('../../lib/common')
  , config = require('../../test-config')
  , crypto = require('crypto')
  , exec = require('child_process').exec
  , EventEmitter = require('events').EventEmitter
  , fs = require('fs')
  , github = require('../../lib/github')
  , mongoose = require('mongoose')
  , path = require('path')
  , qs = require('querystring')
  , request = require('request')
  , should = require('should')
  , sinon = require('sinon')
  , Step = require('step')
  ;

var TEST_PORT=8700;

var TEST_BASE_URL="http://localhost:"+TEST_PORT+"/";

var TEST_WEBHOOK_SHA1_SECRET="l1ulAEJQyOTpvjz7r4yNtzZlL4vsV8Zy/jatdRUxvJc=";

TEST_USER_PASSWORD = "test123";

var TEST_USERS = {
  "test1@example.com":{password: TEST_USER_PASSWORD, jar: request.jar()},
  "test2@example.com":{password: TEST_USER_PASSWORD, jar: request.jar()},
  "test3@example.com":{password: TEST_USER_PASSWORD, jar: request.jar()}
};

describe('functional', function() {

  function importCollection(name, file, cb) {
    var db_name = path.basename(config.db_uri);
    var db_port;
    // Load the test data
    console.log("Loading test data ...");
    var user, password;
    if (process.env.MONGODB_USER !== undefined) {
      user = process.env.MONGODB_USER;
    }
    if (process.env.MONGODB_PASSWORD !== undefined) {
      password = process.env.MONGODB_PASSWORD;
    }
    if (process.env.MONGODB_URI !== undefined) {
      var s = process.env.MONGODB_URI;
      db_name = path.basename(s);
      db_port = s.slice(s.lastIndexOf(':') + 1, s.lastIndexOf('/'));
    }
    var cmd = "mongoimport --drop -c " + name + " ";
    if (user && password) {
      cmd = cmd + " -u " + user + " -p " + password;
    }
    if (db_port !== undefined) {
      cmd = cmd + " --port " + db_port;
    }
    cmd = cmd + " -d " + db_name + " --file " + __dirname + "/" + file;

    console.log("Loading data with command: %s", cmd);
    exec(cmd, cb);
  }

  before(function(done) {
    this.timeout(10000);
    // Inject the test config
    common.workerMessageHooks = [];
    common.workerMessagePostProcessors = [];
    var server = app.init(config);
    var db_name = path.basename(config.db_uri);
    var db_port;
    // Load the test data
    Step(
      function() {
        importCollection("users", "users.json", this.parallel());
        importCollection("jobs", "jobs.json", this.parallel());
      },
      function() {
        console.log("Test data loaded.");
        server.listen(TEST_PORT);
        console.log("Server is listening on port %s", TEST_PORT);
        done();
      }
    );
  });

  describe("auth", function() {
    it("should render /login page with a 200", function(done) {
        request.get(TEST_BASE_URL + "login", function (e, r, body) {
          r.statusCode.should.eql(200);
          done();
        });

    });

    it("bad login should return 302 with an error", function(done) {
        request.post({
            url:TEST_BASE_URL + "login",
            form:{email:"bad", password:"bad"}
          }, function (e, r, body) {
          r.statusCode.should.eql(302);
          r.headers.location.should.eql("/login#fail");
          done();
        });
    });

  });

  describe("api", function() {
    describe("#collaborators", function() {

      var clients = {};

      // log the various clients in
      before(function(done) {
        var complete = 0;
        _.each(TEST_USERS, function(opts, email) {
          clients[email] = request.post({url: TEST_BASE_URL + "login",
          form:{email:email, password:opts.password},
          jar:opts.jar,
          }, function(e, r, b) {
            if (e) {
              throw e;
            }
            if (r.statusCode !== 302 || r.headers.location !== '/') {
              throw new Error("Test collaborator couldn't log in! Status code: " + r.statusCode + " email: " + email);
            }
            complete++;
            if (complete === _.size(TEST_USERS)) {
              console.log("collaborators: all users logged in, ready for tests :-)");
              done();
            }
          });
        });
      });

      it("should error if trying to fetch collaborators for an unconfigured repository", function(done) {
        var jar = TEST_USERS[Object.keys(TEST_USERS)[0]].jar
        request({
          url: TEST_BASE_URL + "api/collaborators",
          qs: {url:"http://bad.example.com"},
          jar: jar

        }, function(e, r, b) {
          r.statusCode.should.eql(400);
          var data = JSON.parse(b);
          data.status.should.eql("error");
          done();
        });


      });

      it("should fetch a list of collaborators for an accessible repository", function(done) {
        var jar = TEST_USERS[Object.keys(TEST_USERS)[0]].jar
        request({
          url: TEST_BASE_URL + "api/collaborators",
          qs: {url:"https://github.com/beyondfog/poang"},
          jar: jar

        }, function(e, r, b) {
          r.statusCode.should.eql(200);
          var data = JSON.parse(b);
          data.status.should.eql("ok");
          // 1st test user should be the only collaborator at this point
          data.results[0].email.should.eql(Object.keys(TEST_USERS)[0]);
          data.results[0].access_level.should.eql(1);
          data.results[0].type.should.eql("user");
          done();
        });


      });

      it("should error if trying to fetch collaborators for an repository we don't have access to", function(done) {
        var jar = TEST_USERS[Object.keys(TEST_USERS)[1]].jar
        request({
          url: TEST_BASE_URL + "api/collaborators",
          qs: {url:"https://github.com/beyondfog/poang"},
          jar: jar

        }, function(e, r, b) {
          r.statusCode.should.eql(400);
          var data = JSON.parse(b);
          data.status.should.eql("error");
          done();
        });


      });

      it("should be able to add an existing user as a collaborator and delete them", function(done) {
        var email_to_add = Object.keys(TEST_USERS)[1]
        var jar = TEST_USERS[Object.keys(TEST_USERS)[0]].jar
        Step(
          // Add a new collaborator
          function() {
            request.post({
              url: TEST_BASE_URL + "api/collaborators",
              qs: {url:"https://github.com/beyondfog/poang", email:email_to_add},
              jar: jar
            }, this);
          },
          // Verify success adding, start HTTP request to list collaborators
          function(e, r, b) {
            r.statusCode.should.eql(200);
            var data = JSON.parse(b);
            data.status.should.eql("ok");
            request({
              url: TEST_BASE_URL + "api/collaborators",
              qs: {url:"https://github.com/beyondfog/poang"},
              jar: jar
            }, this);
          },
          // Verify that new user is now in collaborators list
          function(e, r, b) {
            if (e) throw e;
            r.statusCode.should.eql(200);
            var data = JSON.parse(b);
            data.status.should.eql("ok");
            // We should have two test users
            data.results.length.should.eql(2);
            data.results[1].email.should.eql(Object.keys(TEST_USERS)[0]);
            data.results[1].access_level.should.eql(1);
            data.results[1].type.should.eql("user");
            data.results[0].email.should.eql(Object.keys(TEST_USERS)[1]);
            data.results[0].access_level.should.eql(0);
            data.results[0].type.should.eql("user");
            // Now delete it
            request({
              url: TEST_BASE_URL + "api/collaborators",
              qs: {url:"https://github.com/beyondfog/poang", email:email_to_add},
              method: "delete",
              jar: jar
            }, this);
          }, 
          function(e, r, b) {
            if (e) throw e;
            r.statusCode.should.eql(200);
            var data = JSON.parse(b);
            data.status.should.eql("ok");
            // Fetch collaborators list again
            request({
              url: TEST_BASE_URL + "api/collaborators",
              qs: {url:"https://github.com/beyondfog/poang"},
              jar: jar
            }, this);

          },
          function(e, r, b) {
            if (e) throw e;
            r.statusCode.should.eql(200);
            var data = JSON.parse(b);
            data.status.should.eql("ok");
            // We should have one test user
            data.results.length.should.eql(1);
            data.results[0].email.should.eql(Object.keys(TEST_USERS)[0]);
            data.results[0].access_level.should.eql(1);
            data.results[0].type.should.eql("user");
            done();
          }

        );
      });

      it("should be able to modify an existing collaborator's access_level", function(done) {
        var email_to_add = Object.keys(TEST_USERS)[1]
        var jar = TEST_USERS[Object.keys(TEST_USERS)[0]].jar
        Step(
          // Give test2@example.com admin privileges
          function() {
            request.post({
              url: TEST_BASE_URL + "api/collaborators",
              qs: {url:"https://github.com/beyondfog/poang", email:email_to_add, access_level:1},
              jar: jar
            }, this);
          },
          // Verify success, start HTTP request to list collaborators
          function(e, r, b) {
            r.statusCode.should.eql(200);
            var data = JSON.parse(b);
            data.status.should.eql("ok");
            request({
              url: TEST_BASE_URL + "api/collaborators",
              qs: {url:"https://github.com/beyondfog/poang"},
              jar: jar
            }, this);
          },
          // Verify that new user is now in collaborators list with admin privileges
          function(e, r, b) {
            if (e) throw e;
            r.statusCode.should.eql(200);
            var data = JSON.parse(b);
            data.status.should.eql("ok");
            // We should have two test users
            data.results.length.should.eql(2);
            data.results[1].email.should.eql(Object.keys(TEST_USERS)[0]);
            data.results[1].access_level.should.eql(1);
            data.results[1].type.should.eql("user");
            data.results[1].owner.should.eql(true);
            data.results[0].email.should.eql(Object.keys(TEST_USERS)[1]);
            data.results[0].access_level.should.eql(1);
            data.results[0].type.should.eql("user");
            data.results[0].owner.should.eql(false);
            done();
          }
        );
      });

      it("collaborator should be able to fetch jobs for project", function(done) {
        var jar = TEST_USERS[Object.keys(TEST_USERS)[1]].jar
        Step(
          // Kick off a new job
          function() {
            request.post({
              url: TEST_BASE_URL + "api/jobs/start",
              qs: {url:"https://github.com/beyondfog/poang", type:"TEST_ONLY"},
              jar: jar
            }, this);
          },
          // Verify success starting job and fetch jobs list
          function(e, r, b) {
            if (e) {
              throw e;
            }
            r.statusCode.should.eql(200);
            request({
              url: TEST_BASE_URL + "api/jobs",
              jar: jar
            }, this);
          },
          // Verify that the collaborator project is in the jobs list
          function(e, r, b) {
            if (e) {
              throw e;
            }
            r.statusCode.should.eql(200);
            var data = JSON.parse(b);
            data.length.should.eql(1);
            data[0].repo_url.should.eql("https://github.com/beyondfog/poang");
            done();
          }
        );
      });

      it("should not be able to add owner as a collaborator", function(done) {
        var owner_email = Object.keys(TEST_USERS)[0];
        var jar = TEST_USERS[Object.keys(TEST_USERS)[0]].jar;
        var new_jar = request.jar();
        var poang = "https://github.com/beyondfog/poang";
        Step(
          // Add a new collaborator
          function() {
            request.post({
              url: TEST_BASE_URL + "api/collaborators",
              qs: {url:poang, email:owner_email},
              jar: jar
            }, this);
          },
          // Verify success adding, query database for invite object with correct data
          function(e, r, b) {
            r.statusCode.should.eql(400);
            var data = JSON.parse(b);
            data.status.should.eql("error");
            data.errors[0].should.include("Can't add owner as collaborator");
            done();
          }
        );
      });

      it("should be able to invite a non-existing user as a collaborator", function(done) {
        var email_to_add = "testunregistered@example.com";
        var jar = TEST_USERS[Object.keys(TEST_USERS)[0]].jar;
        var new_jar = request.jar();
        var poang = "https://github.com/beyondfog/poang";
        Step(
          // Add a new collaborator
          function() {
            request.post({
              url: TEST_BASE_URL + "api/collaborators",
              qs: {url:poang, email:email_to_add},
              jar: jar
            }, this);
          },
          // Verify success adding, query database for invite object with correct data
          function(e, r, b) {
            r.statusCode.should.eql(200);
            var data = JSON.parse(b);
            data.status.should.eql("ok");
            console.log("models.InviteCode: %j", models.InviteCode);
            models.InviteCode.findOne({emailed_to: email_to_add, consumed_timestamp: null}, this);
          },
          // Verify the invite exists in database
          function(err, invite) {
            if (err) throw err;
            should.exist(invite);
            invite.collaborations[0].repo_url.should.eql(poang);
            invite.collaborations[0].access_level.should.eql(0);
            // try to register a new user using the invitation
            request.post({
              url: TEST_BASE_URL + "register",
              form: {invite_code: invite.code, email: email_to_add, password:"foopassword"},
              jar: new_jar
            }, this);
          },
          function(e, r, b) {
            if (e) throw e;
            r.statusCode.should.eql(302);
            r.headers.location.should.eql('/');
            // Verify the new user can see the poang repository it should be a collaborator for
            request.get({
              url: TEST_BASE_URL + "api/collaborators",
              qs: {url:poang},
              jar: new_jar
            }, this);
          }, function(e, r, b) {
            if (e) throw e;
            r.statusCode.should.eql(200);
            var data = JSON.parse(b);
            data.status.should.eql("ok");
            // We should have three test users
            data.results.length.should.eql(3);
            data.results[1].email.should.eql(email_to_add);
            data.results[1].access_level.should.eql(0);
            data.results[1].type.should.eql("user");
            data.results[2].email.should.eql(Object.keys(TEST_USERS)[0]);
            data.results[2].access_level.should.eql(1);
            data.results[2].type.should.eql("user");
            data.results[0].email.should.eql(Object.keys(TEST_USERS)[1]);
            data.results[0].access_level.should.eql(1);
            data.results[0].type.should.eql("user");
            done();
          }

        );
      });
    })
  });


});
