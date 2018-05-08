'use strict';
const util = require('util');

class NonError extends Error {
	constructor(message) {
		super(util.inspect(message));
		this.name = 'NonError';
		Error.captureStackTrace(this, NonError);
	}
}

module.exports = input => {
	if (!(input instanceof Error)) {
		return new NonError(input);
	}

	const err = input;

	if (!err.name) {
		err.name = (err.constructor && err.constructor.name) || 'Error';
	}

	if (!err.message) {
		err.message = '<No error message>';
	}

	if (!err.stack) {
		err.stack = (new Error(err.message)).stack.replace(/\n {4}at /, '\n<Original stack missing>$&');
	}

	return err;
};
