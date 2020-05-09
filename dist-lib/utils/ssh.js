const debug = require('debug')('strider:ssh');
const NodeRSA = require('node-rsa');
const sshpk = require('sshpk');
/**
 * Generates an RSA/SSH keypair.
 * @param comment {string} The comment to put on the public key.
 * @param callback
 */
exports.generateKeyPair = function (comment, callback) {
    debug('Generating SSH key pair...');
    try {
        const key = new NodeRSA();
        key.generateKeyPair();
        const privateKeyPem = key.exportKey('pkcs1-private-pem');
        const publicKeyPem = key.exportKey('pkcs1-public-pem');
        const publicKey = sshpk.parseKey(publicKeyPem, 'pem');
        publicKey.comment = comment;
        callback(null, privateKeyPem, publicKey.toString());
    }
    catch (error) {
        callback(error);
    }
};
//# sourceMappingURL=ssh.js.map