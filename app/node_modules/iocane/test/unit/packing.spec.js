const { packEncryptedContent, unpackEncryptedContent } = require("../../source/packing.js");

describe("packing", function() {
    describe("packEncryptedContent", function() {
        it("packs everything into a string", function() {
            const output = packEncryptedContent("ENC", "IV", "SALT", "AUTH", 1000, "gcm");
            expect(output).to.equal("ENC$IV$SALT$AUTH$1000$gcm");
        });
    });

    describe("unpackEncryptedContent", function() {
        beforeEach(function() {
            this.packed = packEncryptedContent("ENC", "IV", "SALT", "AUTH", 1000, "gcm");
        });

        it("unpacks to correct properties", function() {
            const unpacked = unpackEncryptedContent(this.packed);
            expect(unpacked).to.have.property("content", "ENC");
            expect(unpacked).to.have.property("iv", "IV");
            expect(unpacked).to.have.property("salt", "SALT");
            expect(unpacked).to.have.property("auth", "AUTH");
            expect(unpacked).to.have.property("rounds", 1000);
            expect(unpacked).to.have.property("method", "gcm");
        });
    });
});
