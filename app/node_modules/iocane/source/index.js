const { getConfiguration } = require("./global.js");
const Session = require("./Session.js");

/**
 * Configure global values
 * @returns {Configuration} The global configuration instance
 */
function configure() {
    return getConfiguration();
}

/**
 * Start new encryption/decryption session
 * @returns {Session} New crypto session
 */
function createSession() {
    return new Session();
}

/**
 * @module iocane
 */
module.exports = {
    configure,
    createSession
};
