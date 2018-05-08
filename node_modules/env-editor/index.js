'use strict';
const path = require('path');

const editors = () => [{
	id: 'sublime',
	name: 'Sublime Text',
	bin: 'subl',
	isTerminalEditor: false,
	paths: [
		'/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl',
		'/Applications/Sublime Text 2.app/Contents/SharedSupport/bin/subl'
	],
	keywords: []
}, {
	id: 'atom',
	name: 'Atom',
	bin: 'atom',
	isTerminalEditor: false,
	paths: [
		'/Applications/Atom.app/Contents/Resources/app/atom.sh'
	],
	keywords: []
}, {
	id: 'vscode',
	name: 'Visual Studio Code',
	bin: 'code',
	isTerminalEditor: false,
	paths: [
		'/Applications/Visual Studio Code.app/Contents/Resources/app/bin/code'
	],
	keywords: [
		'vs code'
	]
}, {
	id: 'webstorm',
	name: 'WebStorm',
	bin: 'wstorm',
	isTerminalEditor: false,
	paths: [],
	keywords: []
}, {
	id: 'textmate',
	name: 'TextMate',
	bin: 'mate',
	isTerminalEditor: false,
	paths: [],
	keywords: []
}, {
	id: 'vim',
	name: 'Vim',
	bin: 'vim',
	isTerminalEditor: true,
	paths: [],
	keywords: []
}, {
	id: 'neovim',
	name: 'NeoVim',
	bin: 'nvim',
	isTerminalEditor: true,
	paths: [],
	keywords: [
		'vim'
	]
}, {
	id: 'intellij',
	name: 'IntelliJ IDEA',
	bin: 'idea',
	isTerminalEditor: false,
	paths: [],
	keywords: [
		'idea',
		'java',
		'jetbrains',
		'ide'
	]
}];

const get = input => {
	input = input.trim();
	const needle = input.toLowerCase();
	const id = needle.split(/[/\\]/).pop().replace(/\s/g, '-');
	const bin = id.split('-')[0];

	for (const editor of editors()) {
		// TODO: Maybe use `leven` module for more flexible matching
		if (
			needle === editor.id ||
			needle === editor.name.toLowerCase() ||
			bin === editor.bin
		) {
			return editor;
		}

		for (const p of editor.paths) {
			if (path.normalize(needle) === path.normalize(p)) {
				return editor;
			}
		}

		for (const keyword of editor.keywords) {
			if (needle === keyword) {
				return editor;
			}
		}
	}

	return {
		id,
		name: input,
		bin,
		isTerminalEditor: false,
		paths: [],
		keywords: []
	};
};

module.exports.default = () => {
	const editor = process.env.EDITOR || process.env.VISUAL;

	if (!editor) {
		throw new Error(
`
Your $EDITOR environment variable is not set.
Set it to the command/path of your editor in ~/.zshenv or ~/.bashrc:

  export EDITOR=atom
`
		);
	}

	return get(editor);
};

module.exports.get = get;
module.exports.all = editors;
