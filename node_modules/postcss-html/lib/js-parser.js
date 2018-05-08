"use strict";

const parse = require("babylon").parse;
const traverse = require("@babel/traverse").default;
const requireParser = require("./require-parser");
const htmlParser = requireParser("html");

function isScriptModule (attribute) {
	if (attribute && attribute.type) {
		return /^module$/i.test(attribute.type);
	}
}

function getSourceType (filename) {
	if (filename && /\.m[tj]sx?$/.test(filename)) {
		return "module";
	}
	try {
		return require("@babel/core").loadOptions({
			filename,
		}).sourceType;
	} catch (ex) {
		//
	}
}

function getOptions (opts, attribute) {
	const filename = opts.from && opts.from.replace(/\?.*$/, "");
	return {
		sourceFilename: filename,
		sourceType: isScriptModule(attribute) ? "module" : (getSourceType(filename) || "unambiguous"),
		plugins: [
			"jsx",
			"typescript",
			"objectRestSpread",
			"decorators",
			"classProperties",
			"exportExtensions",
			"asyncGenerators",
			"functionBind",
			"functionSent",
			"dynamicImport",
			"optionalCatchBinding",
		],
	};
}

function skip (attribute) {
	if (!attribute) {
		return;
	}
	if (attribute.lang) {
		return !/^(?:(?:java|type)script|m?[jt]sx?)$/i.test(attribute.lang);
	} else if (attribute.type) {
		return !/^(?:module|\w+\/(?:x-)?(?:java|type)script)$/i.test(attribute.type);
	}
}

module.exports = function (source, opts, attribute) {
	const styles = [];
	if (skip(attribute)) {
		return styles;
	}
	let ast;
	try {
		ast = parse(source, getOptions(opts, attribute));
	} catch (ex) {
		return styles;
	}

	traverse(ast, {
		noScope: true,
		enter (path) {
			if (path.node.type === "TemplateElement") {
				const styleHtm = htmlParser(path.node.value.raw, opts);
				if (styleHtm) {
					styleHtm.forEach(style => {
						style.startIndex += path.node.start;
						styles.push(style);
					});
				}
			}
		},
	});
	return styles;
};
