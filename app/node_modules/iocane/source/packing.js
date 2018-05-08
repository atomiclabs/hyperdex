const { ALGO_DEFAULT } = require("./shared.js");

const PBKDF2_ROUND_DEFAULT = 1000;

/**
 * Encrypted content components
 * @typedef {Object} EncryptedComponents
 * @property {String} content - The encrypted string
 * @property {String} iv - The IV in hex form
 * @property {String} salt - The salt
 * @property {String} hmac - The HMAC in hex form
 * @property {Number} rounds - The PBKDF2 rounds
 * @property {String} method - The encryption method (cbc/gcm)
 */

/**
 * Pack encrypted content components into the final encrypted form
 * @param {String} encryptedContent The encrypted text
 * @param {String} iv The IV in hex form
 * @param {String} salt The salt
 * @param {String} auth The HMAC for CBC mode, or the authentication tag for GCM mode
 * @param {Number} rounds The PBKDF2 round count
 * @param {String} method The encryption method (cbc/gcm)
 * @returns {String} The final encrypted form
 */
function packEncryptedContent(encryptedContent, iv, salt, auth, rounds, method) {
    return [encryptedContent, iv, salt, auth, rounds, method].join("$");
}

/**
 * Unpack encrypted content components from an encrypted string
 * @param {String} encryptedContent The encrypted string
 * @returns {EncryptedComponents} The extracted components
 * @throws {Error} Throws if the number of components is incorrect
 */
function unpackEncryptedContent(encryptedContent) {
    const [content, iv, salt, auth, roundsRaw, methodRaw] = encryptedContent.split("$");
    // iocane was originally part of Buttercup's core package and used defaults from that originally.
    // There will be 4 components for pre 0.15.0 archives, and 5 in newer archives. The 5th component
    // is the pbkdf2 round count, which is optional:
    const rounds = roundsRaw ? parseInt(roundsRaw, 10) : PBKDF2_ROUND_DEFAULT;
    // Originally only "cbc" was supported, but GCM was added in version 1
    const method = methodRaw || "cbc";
    return {
        content,
        iv,
        salt,
        auth,
        rounds,
        method
    };
}

module.exports = {
    packEncryptedContent,
    unpackEncryptedContent
};
