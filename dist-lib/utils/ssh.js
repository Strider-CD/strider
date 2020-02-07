var debug = require('debug')('strider:ssh');
var NodeRSA = require('node-rsa');
var sshpk = require('sshpk');
/**
 * Generates an RSA/SSH keypair.
 * @param comment {string} The comment to put on the public key.
 * @param callback
 */
exports.generateKeyPair = function (comment, callback) {
    debug('Generating SSH key pair...');
    try {
        var key = new NodeRSA();
        key.generateKeyPair();
        var privateKeyPem = key.exportKey('pkcs1-private-pem');
        var publicKeyPem = key.exportKey('pkcs1-public-pem');
        var publicKey = sshpk.parseKey(publicKeyPem, 'pem');
        publicKey.comment = comment;
        callback(null, privateKeyPem, publicKey.toString());
    }
    catch (error) {
        callback(error);
    }
};
//# sourceMappingURL=ssh.js.map