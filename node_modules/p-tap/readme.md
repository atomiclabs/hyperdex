# p-tap [![Build Status](https://travis-ci.org/sindresorhus/p-tap.svg?branch=master)](https://travis-ci.org/sindresorhus/p-tap)

> Tap into a promise chain without affecting its value or state


## Install

```
$ npm install --save p-tap
```


## Usage

```js
const pTap = require('p-tap');

Promise.resolve('unicorn')
	.then(pTap(console.log)) // logs `unicorn`
	.then(value => {
		// `value` is still `unicorn`
	});
```

```js
const pTap = require('p-tap');

getUser()
	.then(tap(user => saveUser(user))) // `user` is saved async before the chain continues
	.then(user => {
		// `user` is the user from getUser(), not recordStatsAsync()
	});
```

```js
const pTap = require('p-tap');

Promise.resolve(() => doSomething())
	.catch(pTap.catch(console.error)) // prints any errors
	.then(handleSuccess)
	.catch(handleError);
```


## API

### pTap(input)

Use this in a `.then()` method.

Returns a [thunk](https://en.m.wikipedia.org/wiki/Thunk) that returns a `Promise`.

### pTap.catch(input)

Use this in a `.catch()` method.

Returns a [thunk](https://en.m.wikipedia.org/wiki/Thunk) that returns a `Promise`.

#### input

Type: `Function`

Any return value or exception is ignored.

If `input` returns a `Promise`, it will be awaited before passing through the original value.


## Related

- [p-log](https://github.com/sindresorhus/p-log) - Log the value/error of a promise
- [p-if](https://github.com/sindresorhus/p-if) - Conditional promise chains
- [More…](https://github.com/sindresorhus/promise-fun)


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
