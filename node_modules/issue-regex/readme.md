# issue-regex [![Build Status](https://travis-ci.org/sindresorhus/issue-regex.svg?branch=master)](https://travis-ci.org/sindresorhus/issue-regex)

> Regular expression for matching issue references


## Install

```
$ npm install --save issue-regex
```


## Usage

```js
const issueRegex = require('issue-regex');

'Fixes #143 and avajs/ava#1023'.match(issueRegex());
//=> ['#143', 'avajs/ava#1023']
```


## API

### issueRegex()

Returns a `RegExp` for matching issue references.


## Related

- [linkify-issues](https://github.com/sindresorhus/linkify-issues) - Linkify GitHub issue references


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
