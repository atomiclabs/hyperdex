'use strict';
const {createSession} = require('iocane');

const session = createSession()
	.use('cbc')
	.setDerivationRounds(300000);

module.exports = {
	encrypt: session.encrypt.bind(session),
	decrypt: session.decrypt.bind(session),
};
