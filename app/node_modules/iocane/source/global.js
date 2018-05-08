const Configuration = require("./Configuration.js");

const __instance = new Configuration();

/**
 * Get the global configuration instance
 * @returns {Configuration} The shared, global configuration instance
 */
function getConfiguration() {
    return __instance;
}

module.exports = {
    getConfiguration
};
