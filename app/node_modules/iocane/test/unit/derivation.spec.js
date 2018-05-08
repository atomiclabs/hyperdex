const { deriveFromPassword, pbkdf2 } = require("../../source/derivation.js");

describe("derivation", function() {
    describe("deriveFromPassword", function() {
        it("derives keys", function() {
            return deriveFromPassword(pbkdf2, "pass", "aaaa", 1001).then(keyInfo => {
                expect(keyInfo).to.have.property("salt", "aaaa");
                expect(keyInfo).to.have.property("rounds", 1001);
                expect(keyInfo)
                    .to.have.property("key")
                    .that.is.an.instanceof(Buffer);
                expect(keyInfo)
                    .to.have.property("hmac")
                    .that.is.an.instanceof(Buffer);
            });
        });

        it("generates keys and HMACs with the correct size", function() {
            return deriveFromPassword(pbkdf2, "pass", "aaaa", 1001).then(keyInfo => {
                expect(keyInfo.key).to.have.lengthOf(32);
                expect(keyInfo.hmac).to.have.lengthOf(32);
            });
        });

        it("supports disabling HMAC", function() {
            return deriveFromPassword(pbkdf2, "pass", "aaaa", 1001, false).then(keyInfo => {
                expect(keyInfo.key).to.have.lengthOf(32);
                expect(keyInfo.hmac).to.be.undefined;
            });
        });

        it("rejects if the password is not provided", function() {
            return expect(
                deriveFromPassword(pbkdf2, "", "aaaa", 1001, false)
            ).to.eventually.be.rejectedWith(/Password must be provided/i);
        });

        it("rejects if the salt is not provided", function() {
            return expect(
                deriveFromPassword(pbkdf2, "pass", "", 1001, false)
            ).to.eventually.be.rejectedWith(/Salt must be provided/i);
        });

        it("rejects if the rounds are not valid", function() {
            return expect(
                deriveFromPassword(pbkdf2, "pass", "aaaa", null, false)
            ).to.eventually.be.rejectedWith(/Rounds must be greater than 0/i);
        });
    });
});
