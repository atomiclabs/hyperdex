const {
    decryptCBC,
    decryptGCM,
    encryptCBC,
    encryptGCM,
    generateIV,
    generateSalt
} = require("../../source/encryption.js");
const { deriveFromPassword, pbkdf2 } = require("../../source/derivation.js");

const ENCRYPTED_SAMPLE = "at5427PQdplGgZgcmIjy/Fv0xZaiKO+bzmY7NsnYj90=";
const ENCRYPTED_SAMPLE_RAW = "iocane secret text";

describe("encryption", function() {
    describe("decryptCBC", function() {
        beforeEach(function() {
            return deriveFromPassword(pbkdf2, "pass", "salt", 1000)
                .then(keyDerivationInfo => {
                    this.keyDerivationInfo = keyDerivationInfo;
                    return generateIV();
                })
                .then(iv => {
                    return encryptCBC(ENCRYPTED_SAMPLE_RAW, this.keyDerivationInfo, iv);
                })
                .then(encryptedComponents => {
                    this.encryptedComponents = encryptedComponents;
                });
        });

        it("decrypts encrypted components", function() {
            return decryptCBC(this.encryptedComponents, this.keyDerivationInfo).then(raw => {
                expect(raw).to.equal(ENCRYPTED_SAMPLE_RAW);
            });
        });
    });

    describe("decryptGCM", function() {
        beforeEach(function() {
            return deriveFromPassword(pbkdf2, "pass", "salt", 1000)
                .then(keyDerivationInfo => {
                    this.keyDerivationInfo = keyDerivationInfo;
                    return generateIV();
                })
                .then(iv => {
                    return encryptGCM(ENCRYPTED_SAMPLE_RAW, this.keyDerivationInfo, iv);
                })
                .then(encryptedComponents => {
                    this.encryptedComponents = encryptedComponents;
                });
        });

        it("decrypts encrypted components", function() {
            return decryptGCM(this.encryptedComponents, this.keyDerivationInfo).then(raw => {
                expect(raw).to.equal(ENCRYPTED_SAMPLE_RAW);
            });
        });
    });

    describe("encryptCBC", function() {
        beforeEach(function() {
            return deriveFromPassword(pbkdf2, "pass", "salt", 1000)
                .then(keyDerivationInfo => {
                    this.keyDerivationInfo = keyDerivationInfo;
                    return generateIV();
                })
                .then(iv => {
                    this.iv = iv;
                });
        });

        it("encrypts text", function() {
            return encryptCBC(ENCRYPTED_SAMPLE_RAW, this.keyDerivationInfo, this.iv).then(
                encrypted => {
                    expect(encrypted)
                        .to.have.property("content")
                        .that.is.a("string");
                    expect(encrypted.content).to.not.contain(ENCRYPTED_SAMPLE_RAW);
                }
            );
        });

        it("outputs expected components", function() {
            return encryptCBC(ENCRYPTED_SAMPLE_RAW, this.keyDerivationInfo, this.iv).then(
                encrypted => {
                    expect(encrypted)
                        .to.have.property("auth")
                        .that.matches(/^[a-f0-9]{64}$/);
                    expect(encrypted).to.have.property("rounds", 1000);
                    expect(encrypted)
                        .to.have.property("iv")
                        .that.matches(/^[a-f0-9]+$/);
                    expect(encrypted).to.have.property("salt", "salt");
                    expect(encrypted).to.have.property("mode", "cbc");
                }
            );
        });
    });

    describe("encryptGCM", function() {
        beforeEach(function() {
            return deriveFromPassword(pbkdf2, "pass", "salt", 1000)
                .then(keyDerivationInfo => {
                    this.keyDerivationInfo = keyDerivationInfo;
                    return generateIV();
                })
                .then(iv => {
                    this.iv = iv;
                });
        });

        it("encrypts text", function() {
            return encryptGCM(ENCRYPTED_SAMPLE_RAW, this.keyDerivationInfo, this.iv).then(
                encrypted => {
                    expect(encrypted)
                        .to.have.property("content")
                        .that.is.a("string");
                    expect(encrypted.content).to.not.contain(ENCRYPTED_SAMPLE_RAW);
                }
            );
        });

        it("outputs expected components", function() {
            return encryptGCM(ENCRYPTED_SAMPLE_RAW, this.keyDerivationInfo, this.iv).then(
                encrypted => {
                    expect(encrypted)
                        .to.have.property("auth")
                        .that.matches(/^[a-f0-9]+$/);
                    expect(encrypted).to.have.property("rounds", 1000);
                    expect(encrypted)
                        .to.have.property("iv")
                        .that.matches(/^[a-f0-9]+$/);
                    expect(encrypted).to.have.property("salt", "salt");
                    expect(encrypted).to.have.property("mode", "gcm");
                }
            );
        });
    });

    describe("generateIV", function() {
        it("generates a buffer", function() {
            return generateIV().then(iv => {
                expect(iv).to.be.an.instanceof(Buffer);
            });
        });

        it("generates a non-empty value", function() {
            return generateIV().then(iv => {
                expect(iv.toString("hex")).to.have.length.above(0);
            });
        });
    });

    describe("generateSalt", function() {
        it("generates the correct length", function() {
            return generateSalt(42).then(salt => {
                expect(salt).to.have.lengthOf(42);
            });
        });

        it("generates base64", function() {
            return generateSalt(31).then(salt => {
                expect(salt).to.match(/^[a-zA-Z0-9/=+]{31}$/);
            });
        });
    });
});
