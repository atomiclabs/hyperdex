"use strict";

const remark = require("remark");
const findAllAfter = require("unist-util-find-all-after");

module.exports = function (source, opts) {
	const ast = remark().parse(source);
	const blocks = findAllAfter(ast, 0, (node) => {
		if (node.type === "code" && node.lang) {
			return /^(?:(?:\w*c)|le|wx|sa?|sugar)ss$/i.test(node.lang);
		}
	});

	return blocks.map((block) => {
		let startIndex = source.indexOf(block.lang, block.position.start.offset) + block.lang.length;
		if (block.value) {
			startIndex = source.indexOf(block.value, startIndex);
		} else {
			startIndex = source.indexOf("\n", startIndex) + 1;
		}
		return {
			startIndex: startIndex,
			lang: block.lang.toLowerCase(),
			isMarkdown: true,
			content: source.slice(startIndex, block.position.end.offset).replace(/[ \t]*`*$/, ""),
		};
	});
};
