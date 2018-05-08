![iocane](https://raw.githubusercontent.com/perry-mitchell/iocane/master/iocane_header.jpg)

NodeJS textual encryption library

[![Buttercup](https://cdn.rawgit.com/buttercup-pw/buttercup-assets/6582a033/badge/buttercup-slim.svg)](https://buttercup.pw) [![Build Status](https://travis-ci.org/perry-mitchell/iocane.svg?branch=master)](https://travis-ci.org/perry-mitchell/iocane) [![Downloads per month on NPM](https://img.shields.io/npm/dm/iocane.svg?maxAge=2592000)](https://www.npmjs.com/package/iocane/) [![npm version](https://badge.fury.io/js/iocane.svg)](https://www.npmjs.com/package/iocane/)

## About
**iocane** makes text encryption and decryption easy by bundling all the complicated processes into one succinct library. Encrypt and decrypt strings easily by using iocane's encryption format - strings in, strings out.

This library uses a global configuration that is inherited by _sessions_. A session describes one encryption/decryption action, and can also have options be further overridden at the time of execution. Check the examples below for a better idea of how this process works.

### Features
**iocane** by default boasts the following features:

 * AES-CBC or AES-GCM encryption
 * 256bit keys
 * PBKDF2 key derivation (with 250k iterations)

## Installation
Install `iocane` as a dependency using `npm`:

```shell
npm install iocane --save
```

## Usage
**iocane** can be easily used to encrypt text:

```javascript
const { createSession } = require("iocane");

createSession()
    .encrypt("some secret text", "myPassword")
    .then(encryptedString => {
        // do something with the encrypted text
    });
```

Decryption is even simpler, as instructions on _how_ to decrypt the payload is included in the payload itself:

```javascript
createSession()
    .decrypt(encryptedString, "myPassword")
    .then(decryptedString => {
        // ...
    });
```

During encryption, you can override a variety of options:

```javascript
createSession()
    .use("gcm") // use GCM encryption
    .setDerivationRounds(300000)
    .encrypt(target, password);
```

Each cryptographic function can be overridden:

```javascript
createSession()
    .overrideDecryption("cbc", cbcDecFn)
    .overrideDecryption("gcm", gcmDecFn)
    .overrideEncryption("cbc", cbcEncFn)
    .overrideEncryption("gcm", gcmEncFn)
    .overrideIVGeneration(genIV)
    .overrideKeyDerivation(deriveKey)
    .overrideSaltGeneration(genSalt)
    .encrypt(/* ... */);
```

Instead of overriding each method for every session, you can use the global configuration instance to override them once for all subsequent sessions:

```javascript
const { configure, createSession } = require("iocane");

configure()
    .use("gcm")
    .overrideDecryption("gcm", gcmDecFn)
    .overrideEncryption("gcm", gcmEncFn);

createSession().encrypt(/* ... */); // Uses global settings
```

_Note that the default encryption mode is `"cbc"` (AES-CBC encryption)._

You can check out the [API documentation](API.md) for more information.

## Supported environments
**iocane** supports NodeJS version 6 and above. Versions prior to 6 were supported in `0.x` but are not anymore.

**iocane** is used in the browser as well, but in very custom situations. Support for using iocane in the browser is not provided through this repository. Please see respositories like [`buttercup`](https://github.com/buttercup/buttercup-core) and [Buttercup browser extension](https://github.com/buttercup/buttercup-browser-extension) for web usage.

_Note: when using iocane in the browser, at very least the key derivation process should be overridden. This is extremely slow if left to the internal derivation method._

## Buttercup
**iocane** was originally part of the [Buttercup](https://github.com/buttercup) suite. Buttercup is a supported dependent of iocane and efforts are made to align iocane with Buttercup's target platforms and uses.
