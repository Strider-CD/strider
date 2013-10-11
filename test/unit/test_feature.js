var should = require('should')
  , sandboxed_module = require('sandboxed-module');


describe('feature', function() {
  it('should default to disabled if no document is found and user is NOT admin', function(done) {

    var user_obj = {email:'test@example.com',account_level:0};

    var fake_feature = {
      findOne: function(name, cb) {
        cb(null, null);
      }
    };


    var feature = sandboxed_module.require('../lib/feature.js', {
      requires: {'./models':{Feature:fake_feature}}
    });

    feature('my-test-feature', user_obj, function(err, is_enabled) {
      should.exist(err);
      is_enabled.should.not.eql(true);
      done();
    });
  });

  it('should be enabled if no document is found and user is admin', function(done) {

    var user_obj = {account_level:1,email:'test@example.com'};

    var fake_feature = {
      findOne: function(name, cb) {
        cb(null, null);
      }
    };


    var feature = sandboxed_module.require('../lib/feature.js', {
      requires: {'./models':{Feature:fake_feature}}
    });

    feature('my-test-feature', user_obj, function(err, is_enabled) {
      should.not.exist(err);
      is_enabled.should.eql(true);
      done();
    });
  });  

  it('should default to disabled if document is found with only name property and user is NOT admin', function(done) {

    var user_obj = {email:'test@example.com'};

    var feature_obj = {
      name: "my-test-feature"
    };

    var fake_feature = {
      findOne: function(name, cb) {
        cb(null, feature_obj);
      }
    };

    var feature = sandboxed_module.require('../lib/feature.js', {
      requires: {'./models':{Feature:fake_feature}}
    });

    feature('my-test-feature', user_obj, function(err, is_enabled) {
      should.exist(err);
      is_enabled.should.not.eql(true);
      done();
    });
  });
  
  it('should be enabled if document is found with only name property and user is admin', function(done) {

    var user_obj = {account_level:1,email:'test@example.com'};

    var feature_obj = {
      name: "my-test-feature"
    };

    var fake_feature = {
      findOne: function(name, cb) {
        cb(null, feature_obj);
      }
    };

    var feature = sandboxed_module.require('../lib/feature.js', {
      requires: {'./models':{Feature:fake_feature}}
    });

    feature('my-test-feature', user_obj, function(err, is_enabled) {
      should.not.exist(err);
      is_enabled.should.eql(true);
      done();
    });
  });
  

  it('should be enabled if document has global_enabled true', function(done) {
    // Not admin
    var user_obj = {email:'test@example.com'};

    var feature_obj = {
      name: "my-test-feature",
      global_enabled: true
    };

    var fake_feature = {
      findOne: function(name, cb) {
        cb(null, feature_obj);
      }
    };

    var feature = sandboxed_module.require('../lib/feature.js', {
      requires: {'./models':{Feature:fake_feature}}
    });

    feature('my-test-feature', user_obj, function(err, is_enabled) {
      should.not.exist(err);
      is_enabled.should.eql(true);
      done();
    });
  });


  it('should be enabled if document has users_enabled with user in list', function(done) {
    var user_obj = {_id:"some id",email:'test@example.com'};

    var feature_obj = {
      name: "my-test-feature",
      // user in list
      users_enabled: ["some id"]
    };

    var fake_feature = {
      findOne: function(name, cb) {
        cb(null, feature_obj);
      }
    };

    var feature = sandboxed_module.require('../lib/feature.js', {
      requires: {'./models':{Feature:fake_feature}}
    });

    feature('my-test-feature', user_obj, function(err, is_enabled) {
      should.not.exist(err);
      is_enabled.should.eql(true);
      done();
    });
  });
});
