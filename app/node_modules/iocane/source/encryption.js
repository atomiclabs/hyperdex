const crypto = require("crypto");
const { constantTimeCompare } = require("./timing.js");

const ENC_ALGORITHM_CBC = "aes-256-cbc";
const ENC_ALGORITHM_GCM = "aes-256-gcm";
const HMAC_ALGORITHM = "sha256";
const HMAC_KEY_SIZE = 32;
const PASSWORD_KEY_SIZE = 32;

/**
 * Encrypted content components
 * @typedef {Object} EncryptedComponents
 * @property {String} content - The encrypted string
 * @property {String} iv - The IV in hex form
 * @property {String} salt - The salt
 * @property {String} auth - The HMAC in hex form for CBC, or tag in hex form for GCM
 * @property {Number} rounds - The PBKDF2 rounds
 * @property {String} method - The encryption method (gcm/cbc)
 */

/**
 * Decrypt text using AES-CBC
 * @param {EncryptedComponents} encryptedComponents Encrypted components
 * @param {DerivedKeyInfo} keyDerivationInfo Key derivation information
 * @returns {Promise.<String>} A promise that resolves with the decrypted string
 */
function decryptCBC(encryptedComponents, keyDerivationInfo) {
    // Extract the components
    const encryptedContent = encryptedComponents.content;
    const iv = new Buffer(encryptedComponents.iv, "hex");
    const salt = encryptedComponents.salt;
    const hmacData = encryptedComponents.auth;
    // Get HMAC tool
    const hmacTool = crypto.createHmac(HMAC_ALGORITHM, keyDerivationInfo.hmac);
    // Generate the HMAC
    hmacTool.update(encryptedContent);
    hmacTool.update(encryptedComponents.iv);
    hmacTool.update(salt);
    const newHmaxHex = hmacTool.digest("hex");
    // Check hmac for tampering
    if (constantTimeCompare(hmacData, newHmaxHex) !== true) {
        throw new Error("Authentication failed while decrypting content");
    }
    // Decrypt
    const decryptTool = crypto.createDecipheriv(ENC_ALGORITHM_CBC, keyDerivationInfo.key, iv);
    const decryptedText = decryptTool.update(encryptedContent, "base64", "utf8");
    return Promise.resolve(`${decryptedText}${decryptTool.final("utf8")}`);
}

/**
 * Decrypt text using AES-GCM
 * @param {EncryptedComponents} encryptedComponents Encrypted components
 * @param {DerivedKeyInfo} keyDerivationInfo Key derivation information
 * @returns {Promise.<String>} A promise that resolves with the decrypted string
 */
function decryptGCM(encryptedComponents, keyDerivationInfo) {
    // Extract the components
    const encryptedContent = encryptedComponents.content;
    const iv = new Buffer(encryptedComponents.iv, "hex");
    const { auth: tagHex, salt } = encryptedComponents;
    // Prepare tool
    const decryptTool = crypto.createDecipheriv(ENC_ALGORITHM_GCM, keyDerivationInfo.key, iv);
    // Add additional auth data
    decryptTool.setAAD(new Buffer(`${encryptedComponents.iv}${keyDerivationInfo.salt}`, "utf8"));
    // Set auth tag
    decryptTool.setAuthTag(new Buffer(tagHex, "hex"));
    // Perform decryption
    const decryptedText = decryptTool.update(encryptedContent, "base64", "utf8");
    return Promise.resolve(`${decryptedText}${decryptTool.final("utf8")}`);
}

/**
 * Encrypt text using AES-CBC
 * @param {String} text The text to encrypt
 * @param {DerivedKeyInfo} keyDerivationInfo Key derivation information
 * @param {Buffer} iv A buffer containing the IV
 * @returns {Promise.<EncryptedComponents>} A promise that resolves with encrypted components
 */
function encryptCBC(text, keyDerivationInfo, iv) {
    return Promise.resolve().then(() => {
        const ivHex = iv.toString("hex");
        const encryptTool = crypto.createCipheriv(ENC_ALGORITHM_CBC, keyDerivationInfo.key, iv);
        const hmacTool = crypto.createHmac(HMAC_ALGORITHM, keyDerivationInfo.hmac);
        const { rounds } = keyDerivationInfo;
        // Perform encryption
        let encryptedContent = encryptTool.update(text, "utf8", "base64");
        encryptedContent += encryptTool.final("base64");
        // Generate hmac
        hmacTool.update(encryptedContent);
        hmacTool.update(ivHex);
        hmacTool.update(keyDerivationInfo.salt);
        const hmacHex = hmacTool.digest("hex");
        // Output encrypted components
        return {
            mode: "cbc",
            auth: hmacHex,
            iv: ivHex,
            salt: keyDerivationInfo.salt,
            rounds,
            content: encryptedContent
        };
    });
}

/**
 * Encrypt text using AES-GCM
 * @param {String} text The text to encrypt
 * @param {DerivedKeyInfo} keyDerivationInfo Key derivation information
 * @param {Buffer} iv A buffer containing the IV
 * @returns {Promise.<EncryptedComponents>} A promise that resolves with encrypted components
 */
function encryptGCM(text, keyDerivationInfo, iv) {
    return Promise.resolve().then(() => {
        const ivHex = iv.toString("hex");
        const { rounds } = keyDerivationInfo;
        const encryptTool = crypto.createCipheriv(ENC_ALGORITHM_GCM, keyDerivationInfo.key, iv);
        // Add additional auth data
        encryptTool.setAAD(new Buffer(`${ivHex}${keyDerivationInfo.salt}`, "utf8"));
        // Perform encryption
        let encryptedContent = encryptTool.update(text, "utf8", "base64");
        encryptedContent += encryptTool.final("base64");
        // Handle authentication
        const tag = encryptTool.getAuthTag();
        // Output encrypted components
        return {
            mode: "gcm",
            iv: ivHex,
            salt: keyDerivationInfo.salt,
            rounds,
            content: encryptedContent,
            auth: tag.toString("hex")
        };
    });
}

/**
 * IV generator
 * @returns {Promise.<Buffer>} A promise that resolves with an IV
 */
function generateIV() {
    return Promise.resolve(new Buffer(crypto.randomBytes(16)));
}

/**
 * Salt generator
 * @param {Number} length The length of the string to generate
 * @returns {Promise.<String>} A promise that resolves with a salt (hex)
 * @throws {Error} Rejects if length is invalid
 */
function generateSalt(length) {
    if (length <= 0) {
        return Promise.reject(
            new Error(`Failed generating salt: Invalid length supplied: ${length}`)
        );
    }
    let output = "";
    while (output.length < length) {
        output += crypto.randomBytes(3).toString("base64");
        if (output.length > length) {
            output = output.substr(0, length);
        }
    }
    return Promise.resolve(output);
}

module.exports = {
    decryptCBC,
    decryptGCM,
    encryptCBC,
    encryptGCM,
    generateIV,
    generateSalt
};
