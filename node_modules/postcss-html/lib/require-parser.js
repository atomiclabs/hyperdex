"use strict";

module.exports = lang => {
	let parser;

	return function () {
		if (!parser) {
			parser = require(`./${lang}-parser`);
		}
		return parser.apply(this, arguments);
	};
}; ;
