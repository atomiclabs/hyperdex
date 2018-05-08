"use strict";

const htmlparser = require("htmlparser2");
const requireParser = require("./require-parser");
const jsParser = requireParser("js");

function iterateCode (source, onStyleTag, onStyleAttribute) {
	const currentTag = {};
	let level = 0;
	let isFirstTag = true;

	function onFirstTag () {
		// Found a tag, the structure is now confirmed as HTML
		if (isFirstTag) {
			if (parser.startIndex <= 0 || !source.slice(0, parser.startIndex).trim()) {
				level = 2;
			}
			isFirstTag = false;
		}
	}

	const parser = new htmlparser.Parser({
		oncomment: onFirstTag,
		onprocessinginstruction: onFirstTag,
		onopentag (name, attribute) {
			onFirstTag();

			if (!level) {
				level = 1;
			}

			// Test if current tag is a valid <script> or <style> tag.
			if (!/^(?:script|style)$/i.test(name) || attribute.src) {
				return;
			}

			currentTag[name] = {
				tagName: name,
				attribute,
				startIndex: parser.endIndex + 1,
			};
		},

		onclosetag (name) {
			const tag = currentTag[name];
			if (!tag) {
				return;
			}
			currentTag[name] = null;
			tag.content = source.slice(tag.startIndex, parser.startIndex);
			onStyleTag(tag);
		},

		onattribute (name, value) {
			if (name !== "style") {
				return;
			}
			onStyleAttribute(value, parser.endIndex);
		},
	});

	parser.parseComplete(source);

	return level;
}

function getSubString (str, regexp) {
	const subStr = str && regexp.exec(str);
	if (subStr) {
		return subStr[1].toLowerCase();
	}
}

function getLang (attribute) {
	return getSubString(attribute.type, /^\w+\/(?:x-)?(\w+)$/i) || getSubString(attribute.lang, /^(\w+)(?:\?.+)?$/) || "css";
}

function htmlParser (source, opts) {
	const styles = [];

	const onTag = {
		style: function onStyleTag (style) {
			const firstNewLine = /^[ \t]*\r?\n/.exec(style.content);
			style.lang = getLang(style.attribute);
			if (firstNewLine) {
				const offset = firstNewLine[0].length;
				style.startIndex += offset;
				style.content = style.content.slice(offset);
			}
			style.content = style.content.replace(/[ \t]*$/, "");
			style.isHTMLTag = true;
			styles.push(style);
		},
		script: function onScriptTag (script) {
			jsParser(script.content, opts, script.attribute).forEach(style => {
				style.startIndex += script.startIndex;
				styles.push(style);
			});
		},
	};
	function onStyleAttribute (content, index) {
		styles.push({
			content: content,
			startIndex: source.indexOf(content, index),
			isHTMLAttribute: true,
		});
	}
	const level = iterateCode(source, tag => onTag[tag.tagName](tag), onStyleAttribute);

	if (opts.from ? !level : level < 2) {
		return;
	}

	return styles;
}

module.exports = htmlParser;
