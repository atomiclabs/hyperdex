# string-hash [![Build Status](https://travis-ci.org/sindresorhus/string-hash.svg?branch=master)](https://travis-ci.org/sindresorhus/string-hash)

> Get the hash of a string

Uses the non-cryptographic hash function [FNV-1a](https://github.com/sindresorhus/fnv1a).

Similar to Java's [`String#hashCode()`](https://en.m.wikipedia.org/wiki/Java_hashCode()).


## Install

```
$ npm install @sindresorhus/string-hash
```


## Usage

```js
const stringHash = require('@sindresorhus/string-hash');

stringHash('🦄🌈');
//=> 582881315

stringHash('👌😎');
//=> 879086135
```

It returns a positive integer.


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
