const Configuration = require("./Configuration.js");
const { getConfiguration } = require("./global.js");
const { deriveFromPassword } = require("./derivation.js");
const { packEncryptedContent, unpackEncryptedContent } = require("./packing.js");

/**
 * Encryption session
 * @augments Configuration
 */
class Session extends Configuration {
    constructor() {
        super();
        // Get options from global
        this._options = Object.assign({}, getConfiguration().options);
    }

    /**
     * Decrypt some text
     * @param {String} text The text to decrypt
     * @param {String} password The password to use for decryption
     * @memberof Session
     */
    decrypt(text, password) {
        const encryptedComponents = unpackEncryptedContent(text);
        const { salt, rounds, method } = encryptedComponents;
        const decryptMethod = this.options[`decryption_${method}`];
        return this._deriveKey(password, salt, rounds, method).then(keyDerivationInfo =>
            decryptMethod(encryptedComponents, keyDerivationInfo)
        );
    }

    /**
     * Encrypt some text
     * @param {String} text The text to encrypt
     * @param {String} password The password to use for encryption
     * @returns {Promise.<String>} A promise that resolves with encrypted text
     * @memberof Session
     */
    encrypt(text, password) {
        const { generateIV, method } = this.options;
        const encryptMethod = this.options[`encryption_${method}`];
        return Promise.all([this._deriveNewKey(password), generateIV()])
            .then(([keyDerivationInfo, iv]) => encryptMethod(text, keyDerivationInfo, iv))
            .then(encryptedComponents => {
                const { content, iv, salt, rounds, mode, auth } = encryptedComponents;
                return packEncryptedContent(content, iv, salt, auth, rounds, method);
            });
    }

    /**
     * Derive a key using the current configuration
     * @param {String} password The password
     * @param {String} salt The salt
     * @param {Number=} rounds Key derivation rounds
     * @param {String=} encryptionMethod Encryption method
     * @returns {Promise.<DerivedKeyInfo>} Derived key information
     * @protected
     * @memberof Session
     */
    _deriveKey(password, salt, rounds, encryptionMethod) {
        const { derivationRounds, deriveKey, method: optionsMethod } = this.options;
        const method = encryptionMethod || optionsMethod;
        const deriveKeyCall =
            method === "gcm"
                ? () =>
                      deriveFromPassword(
                          deriveKey,
                          password,
                          salt,
                          rounds || derivationRounds,
                          /* HMAC: */ false
                      )
                : () => deriveFromPassword(deriveKey, password, salt, rounds || derivationRounds);
        return deriveKeyCall();
    }

    /**
     * Derive a new key using the current configuration
     * @param {String} password The password
     * @returns {Promise.<DerivedKeyInfo>} Derived key information
     * @protected
     * @memberof Session
     */
    _deriveNewKey(password) {
        const { generateSalt, saltLength } = this.options;
        return generateSalt(saltLength).then(salt => this._deriveKey(password, salt));
    }
}

module.exports = Session;
