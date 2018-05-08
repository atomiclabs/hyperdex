"use strict";

const Input = require("postcss/lib/input");
const Document = require("./document");
const docFixer = require("./parse-style");
const requireParser = require("./require-parser");
const jsParser = requireParser("js");
const mdParser = requireParser("md");
const htmlParser = requireParser("html");

function parser (source, opts) {
	function filenameMatch (reg) {
		return opts.from && reg.test(opts.from);
	}
	// Skip known style sheet files.
	if (filenameMatch(/\.(?:(?:\w*c|wx|le|sa|s)ss|styl(?:us)?)(?:\?.*)?$/i)) {
		return;
	}

	source = source && source.toString();
	let styles;

	if (filenameMatch(/\.(?:m?[jt]sx?|es\d*|pac)(?:\?.*)?$/i)) {
		styles = jsParser(source, opts);
	} else {
		if (filenameMatch(/\.(?:md|markdown)(?:\?.*)?$/i)) {
			styles = mdParser(source, opts);
		}
		const styleHtm = htmlParser(source, opts);
		if (styleHtm) {
			if (styles) {
				styles.push.apply(styles, styleHtm);
			} else {
				styles = styleHtm;
			}
		} else if (!styles && filenameMatch(/\.(?:[sx]?html?|[sx]ht|vue|ux|php)(?:\?.*)?$/i)) {
			styles = [];
		}
	}

	if (!styles) {
		return;
	}

	const document = new Document();
	const parseStyle = docFixer(source, opts);
	let index = 0;
	styles.sort((a, b) => {
		return a.startIndex - b.startIndex;
	}).forEach(style => {
		const root = parseStyle(style);
		root.raws.beforeStart = source.slice(index, style.startIndex);
		index = style.startIndex + style.content.length;
		document.nodes.push(root);
	});
	document.raws.afterEnd = index ? source.slice(index) : source;
	document.source = {
		input: new Input(source, opts),
		start: {
			line: 1,
			column: 1,
		},
	};

	return document;
}

module.exports = parser;
