'use strict';

exports.parse = input => {
	if (typeof input === 'object') {
		if (!input.file) {
			throw new Error('Missing required `file` property');
		}

		return {
			file: input.file,
			line: input.line || 1,
			column: input.column || 1
		};
	}

	const match = /^(.*?):(\d+)(?::(\d+))?$/.exec(input);

	if (!match) {
		return {
			file: input,
			line: 1,
			column: 1
		};
	}

	if (!match[1]) {
		throw new Error('Missing file path');
	}

	return {
		file: match[1],
		line: Number(match[2]),
		column: Number(match[3]) || 1
	};
};

exports.stringify = (obj, opts) => {
	opts = Object.assign({
		file: true,
		column: true
	}, opts);

	if (!obj.file) {
		throw new Error('Missing required `file` property');
	}

	let ret = '';

	if (opts.file) {
		ret += obj.file;
	}

	if (obj.line) {
		ret += `:${obj.line}`;
	}

	if (obj.line && obj.column && opts.column) {
		ret += `:${obj.column}`;
	}

	if (!opts.file) {
		ret = ret.replace(/^:/, '');
	}

	return ret;
};

