const { createSession } = require("../../source/index.js");

describe("encryption", function() {
    it("can encrypt and decrypt in CBC mode", function() {
        return createSession()
            .use("cbc")
            .setDerivationRounds(1000)
            .encrypt("secret text", "passw0rd")
            .then(encrypted => {
                return createSession().decrypt(encrypted, "passw0rd");
            })
            .then(decrypted => {
                expect(decrypted).to.equal("secret text");
            });
    });

    it("can encrypt and decrypt in GCM mode", function() {
        return createSession()
            .use("gcm")
            .setDerivationRounds(1000)
            .encrypt("secret text", "passw0rd")
            .then(encrypted => {
                return createSession().decrypt(encrypted, "passw0rd");
            })
            .then(decrypted => {
                expect(decrypted).to.equal("secret text");
            });
    });
});
