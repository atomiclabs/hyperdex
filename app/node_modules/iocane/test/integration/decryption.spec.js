const { createSession } = require("../../source/index.js");

describe("decryption", function() {
    it("decrypts content from version 0.*", function() {
        return createSession()
            .decrypt(
                "5YeY3xfU9IdPKnqwaDH3KQ==$019bd022090e9bef921c53a43fe0fa5a$02498e1cd4f2$f50d328c0682c05ec729f3ca888ef6b689fbeb471a6740f8619c89aedc4ebea0$245392",
                "passw0rd"
            )
            .then(decrypted => {
                expect(decrypted).to.equal("test content");
            });
    });
});
