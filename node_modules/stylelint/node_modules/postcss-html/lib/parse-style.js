"use strict";
const reNewLine = /(?:\r?\n|\r)/gm;
const getSyntax = require("./get-syntax");

class LocalFixer {
	constructor (lines, style) {
		let line = 0;
		let column = style.startIndex;
		lines.some((lineEndIndex, lineNumber) => {
			if (lineEndIndex >= style.startIndex) {
				line = lineNumber--;
				if (lineNumber in lines) {
					column = style.startIndex - lines[lineNumber] - 1;
				}
				return true;
			}
		});

		this.line = line;
		this.column = column;
		this.style = style;
	}
	object (object) {
		if (object) {
			if (object.line === 1) {
				object.column += this.column;
			}
			object.line += this.line;
		}
	}
	node (node) {
		this.object(node.source.start);
		this.object(node.source.end);
	}
	root (root) {
		this.object(root.source.start);
		root.walk(node => {
			this.node(node);
		});
	}
	error (error) {
		if (error && error.name === "CssSyntaxError") {
			this.object(error);
			this.object(error.input);
			error.message = error.message.replace(/:\d+:\d+:/, ":" + error.line + ":" + error.column + ":");
		}
		return error;
	}
	parse (opts) {
		const style = this.style;
		const syntax = getSyntax(opts, style.lang);
		let root;
		try {
			root = syntax.parse(style.content, Object.assign({}, opts, {
				map: false,
			}));
		} catch (error) {
			throw this.error(error);
		}
		this.root(root);
		Object.assign(root.source, {
			isHTMLAttribute: !!style.isHTMLAttribute,
			isMarkdown: !!style.isMarkdown,
			isHTMLTag: !!style.isHTMLTag,
			lang: style.lang || "css",
			syntax,
		});

		return root;
	}
}

function docFixer (source, opts) {
	let match;
	const lines = [];
	reNewLine.lastIndex = 0;
	while ((match = reNewLine.exec(source))) {
		lines.push(match.index);
	}
	lines.push(source.length);
	return function parseStyle (style) {
		return new LocalFixer(lines, style).parse(opts);
	};
}
module.exports = docFixer;
