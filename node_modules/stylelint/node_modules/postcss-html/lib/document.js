"use strict";
const PostCssRoot = require("postcss/lib/root");
const stringify = require("./stringify");

class Document extends PostCssRoot {
	toString (stringifier) {
		return super.toString(stringifier || {
			stringify: stringify,
		});
	}

	each (callback) {
		let wasBreak, lastResult;
		this.nodes.forEach(node => {
			const result = node.each(callback);
			if (result === false) {
				wasBreak = true;
			} else {
				lastResult = result;
			}
		});
		if (wasBreak) {
			return false;
		} else {
			return lastResult;
		}
	}

	append () {
		this.last.append.apply(
			this.last,
			Array.from(arguments)
		);
		return this;
	}

	prepend () {
		this.first.prepend.apply(
			this.first,
			Array.from(arguments)
		);
		return this;
	}

	insertBefore (exist, add) {
		exist.prepend(add);
		return this;
	}

	insertAfter (exist, add) {
		exist.append(add);
		return this;
	}
}
module.exports = Document;
