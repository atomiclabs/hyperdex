/**
 * Compare 2 values using time-secure checks
 * @param {String} val1 A value
 * @param {String} val2 Another value
 * @returns {Boolean} True if the values match
 */
function constantTimeCompare(val1, val2) {
    var sentinel;
    if (val1.length !== val2.length) {
        return false;
    }
    for (var i = 0; i <= val1.length - 1; i += 1) {
        sentinel |= val1.charCodeAt(i) ^ val2.charCodeAt(i);
    }
    return sentinel === 0;
}

module.exports = {
    constantTimeCompare
};
