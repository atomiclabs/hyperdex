# env-editor [![Build Status](https://travis-ci.org/sindresorhus/env-editor.svg?branch=master)](https://travis-ci.org/sindresorhus/env-editor)

> Get info about the default editor or a specific editor

This module is used by [`open-editor`](https://github.com/sindresorhus/open-editor).


## Supported editors

- Sublime Text
- Atom
- Visual Studio Code
- WebStorm
- TextMate
- Vim
- NeoVim
- IntelliJ


## Install

```
$ npm install --save env-editor
```


## Usage

```js
const envEditor = require('env-editor');

envEditor.get('sublime');
/*
{
	id: 'sublime',
	name: 'Sublime Text',
	bin: 'subl',
	isTerminalEditor: false,
	paths: [
		'/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl',
		'/Applications/Sublime Text 2.app/Contents/SharedSupport/bin/subl'
	],
	keywords: []
}
*/
```


## API

### .default()

Returns info about the default editor.

The user is expected to have the `$EDITOR` environment variable set, and if not, a user-friendly error is thrown.

### .get(editor)

Returns info about the specified editor.

#### editor

Type: `string`

This can be pretty flexible. It matches against all the data it has.

For example, to get Sublime Text, you could write either of the following: `sublime`, `Sublime Text`, `subl`.

### .all()

Returns an array with info on all the editors.


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
