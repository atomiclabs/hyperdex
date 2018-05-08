# iocane changelog

## **1.0.0** (1.0.0-rc1, 1.0.0-rc2)
_2018-04-02_

 * New, simpler API
   * Easier overriding of crypto methods
 * AES-GCM support
 * Global configuration with session-level overrides (eg. key derivation rounds)
 * Increased salt entropy (base64)
 * Dropped features
   * Encryption using key files has been removed

## 0.10.1
_2017-11-17_

**Security update**

 * [#21 Fix for `debug` package vulnerability](https://github.com/perry-mitchell/iocane/pull/21) (as described in the security issue [here](https://nodesecurity.io/advisories/534))

## 0.10.0
_2017-09-03_

 * Overrides for salt and IV generation

## 0.9.0
_2017-08-28_

 * Core encryption methods now async

## 0.8.0
_2017-08-24_

 * Add support for overriding built in encryption and decryption methods

## 0.7.0
_2017-04-27_

 * Add support for configuring PBKDF2 round boundaries externally

## 0.6.0
_2017-03-06_

 * Increase PBKDF2 rounds to 200-250k

## 0.5.0

 * [Debug](https://github.com/visionmedia/debug) support
 * Improved error message when decrypting with wrong password
