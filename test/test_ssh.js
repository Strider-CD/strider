var assert = require('assert')
  , fs = require('fs')
  , ssh = require('../lib/ssh')
;

describe('ssh', function() {
  describe("#generate_keypair()", function() {
    var privkey = "/tmp/testKey";
    var pubkey = privkey + ".pub";
    it('should generate DSA SSH keypair at specified filesystem location', function(done) {
      this.timeout(10000);
      ssh.generate_keypair("testUser", "/tmp/testKey", function() {
        assert(fs.existsSync(privkey));
        assert(fs.existsSync(pubkey));
        done();
      });
    });
  });
});
