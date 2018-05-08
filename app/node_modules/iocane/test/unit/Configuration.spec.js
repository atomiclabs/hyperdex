const Configuration = require("../../source/Configuration.js");

describe("Configuration", function() {
    it("instantiates without error", function() {
        expect(() => {
            new Configuration();
        }).to.not.throw();
    });

    it("uses 'cbc' mode by default", function() {
        this.configuration = new Configuration();
        expect(this.configuration.options.method).to.equal("cbc");
    });

    describe("get:options", function() {
        beforeEach(function() {
            this.configuration = new Configuration();
        });

        it("returns an object", function() {
            expect(this.configuration.options).to.be.an("object");
        });
    });

    describe("overrideDecryption", function() {
        beforeEach(function() {
            this.configuration = new Configuration();
        });

        it("overrides the decryption method", function() {
            const noop = () => {};
            this.configuration.overrideDecryption("cbc", noop);
            expect(this.configuration.options.decryption_cbc).to.equal(noop);
        });

        it("is able to reset the decryption method", function() {
            const noop = () => {};
            this.configuration.overrideDecryption("cbc", noop);
            this.configuration.overrideDecryption("cbc");
            expect(this.configuration.options.decryption_cbc).to.not.equal(noop);
            expect(this.configuration.options.decryption_cbc).to.be.a("function");
        });

        it("returns self", function() {
            expect(this.configuration.overrideDecryption("cbc")).to.equal(this.configuration);
        });
    });

    describe("overrideEncryption", function() {
        beforeEach(function() {
            this.configuration = new Configuration();
        });

        it("overrides the encryption method", function() {
            const noop = () => {};
            this.configuration.overrideEncryption("cbc", noop);
            expect(this.configuration.options.encryption_cbc).to.equal(noop);
        });

        it("is able to reset the encryption method", function() {
            const noop = () => {};
            this.configuration.overrideEncryption("cbc", noop);
            this.configuration.overrideEncryption("cbc");
            expect(this.configuration.options.encryption_cbc).to.not.equal(noop);
            expect(this.configuration.options.encryption_cbc).to.be.a("function");
        });

        it("returns self", function() {
            expect(this.configuration.overrideEncryption("cbc")).to.equal(this.configuration);
        });
    });

    describe("overrideIVGeneration", function() {
        beforeEach(function() {
            this.configuration = new Configuration();
        });

        it("overrides the IV generation method", function() {
            const noop = () => {};
            this.configuration.overrideIVGeneration(noop);
            expect(this.configuration.options.generateIV).to.equal(noop);
        });

        it("is able to reset the IV generation method", function() {
            const noop = () => {};
            this.configuration.overrideIVGeneration(noop);
            this.configuration.overrideIVGeneration();
            expect(this.configuration.options.generateIV).to.not.equal(noop);
            expect(this.configuration.options.generateIV).to.be.a("function");
        });

        it("returns self", function() {
            expect(this.configuration.overrideIVGeneration()).to.equal(this.configuration);
        });
    });

    describe("overrideKeyDerivation", function() {
        beforeEach(function() {
            this.configuration = new Configuration();
        });

        it("overrides the key derivation method", function() {
            const noop = () => {};
            this.configuration.overrideKeyDerivation(noop);
            expect(this.configuration.options.deriveKey).to.equal(noop);
        });

        it("is able to reset the key derivation method", function() {
            const noop = () => {};
            this.configuration.overrideKeyDerivation(noop);
            this.configuration.overrideKeyDerivation();
            expect(this.configuration.options.deriveKey).to.not.equal(noop);
            expect(this.configuration.options.deriveKey).to.be.a("function");
        });

        it("returns self", function() {
            expect(this.configuration.overrideKeyDerivation()).to.equal(this.configuration);
        });
    });

    describe("overrideSaltGeneration", function() {
        beforeEach(function() {
            this.configuration = new Configuration();
        });

        it("overrides the salt generation method", function() {
            const noop = () => {};
            this.configuration.overrideSaltGeneration(noop);
            expect(this.configuration.options.generateSalt).to.equal(noop);
        });

        it("is able to reset the salt generation method", function() {
            const noop = () => {};
            this.configuration.overrideSaltGeneration(noop);
            this.configuration.overrideSaltGeneration();
            expect(this.configuration.options.generateSalt).to.not.equal(noop);
            expect(this.configuration.options.generateSalt).to.be.a("function");
        });

        it("returns self", function() {
            expect(this.configuration.overrideSaltGeneration()).to.equal(this.configuration);
        });
    });

    describe("reset", function() {
        beforeEach(function() {
            this.configuration = new Configuration();
        });

        it("resets options", function() {
            this.configuration.setDerivationRounds(1234);
            expect(this.configuration.options.derivationRounds).to.equal(1234);
            this.configuration.reset();
            expect(this.configuration.options.derivationRounds).to.equal(
                Configuration.getDefaultOptions().derivationRounds
            );
        });

        it("returns self", function() {
            expect(this.configuration.reset()).to.equal(this.configuration);
        });
    });

    describe("setDerivationRounds", function() {
        beforeEach(function() {
            this.configuration = new Configuration();
        });

        it("sets the rounds", function() {
            this.configuration.setDerivationRounds(4433);
            expect(this.configuration.options.derivationRounds).to.equal(4433);
        });

        it("does not set rounds if invalid", function() {
            this.configuration.setDerivationRounds("abc");
            expect(this.configuration.options.derivationRounds).to.equal(
                Configuration.getDefaultOptions().derivationRounds
            );
            this.configuration.setDerivationRounds(true);
            expect(this.configuration.options.derivationRounds).to.equal(
                Configuration.getDefaultOptions().derivationRounds
            );
            this.configuration.setDerivationRounds(null);
            expect(this.configuration.options.derivationRounds).to.equal(
                Configuration.getDefaultOptions().derivationRounds
            );
        });

        it("returns self", function() {
            expect(this.configuration.setDerivationRounds(1)).to.equal(this.configuration);
        });
    });

    describe("use", function() {
        beforeEach(function() {
            this.configuration = new Configuration();
        });

        it("supports setting 'cbc' mode", function() {
            this.configuration.use("cbc");
            expect(this.configuration.options.method).to.equal("cbc");
        });

        it("supports setting 'gcm' mode", function() {
            this.configuration.use("gcm");
            expect(this.configuration.options.method).to.equal("gcm");
        });

        it("throws for invalid mode", function() {
            expect(() => {
                this.configuration.use("notreal");
            }).to.throw(/Invalid.+encryption.+method/i);
        });

        it("returns self", function() {
            expect(this.configuration.use("cbc")).to.equal(this.configuration);
        });
    });
});
