## Modules

<dl>
<dt><a href="#module_iocane">iocane</a></dt>
<dd></dd>
</dl>

## Classes

<dl>
<dt><a href="#Configuration">Configuration</a></dt>
<dd><p>System configuration</p>
</dd>
<dt><a href="#Session">Session</a> ⇐ <code><a href="#Configuration">Configuration</a></code></dt>
<dd><p>Encryption session</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#deriveFromPassword">deriveFromPassword(pbkdf2Gen, password, salt, rounds, [generateHMAC])</a> ⇒ <code><a href="#DerivedKeyInfo">Promise.&lt;DerivedKeyInfo&gt;</a></code></dt>
<dd><p>Derive a key from a password</p>
</dd>
<dt><a href="#pbkdf2">pbkdf2(password, salt, rounds, bits)</a> ⇒ <code>Promise.&lt;Buffer&gt;</code></dt>
<dd><p>The default PBKDF2 function</p>
</dd>
<dt><a href="#decryptCBC">decryptCBC(encryptedComponents, keyDerivationInfo)</a> ⇒ <code>Promise.&lt;String&gt;</code></dt>
<dd><p>Decrypt text using AES-CBC</p>
</dd>
<dt><a href="#decryptGCM">decryptGCM(encryptedComponents, keyDerivationInfo)</a> ⇒ <code>Promise.&lt;String&gt;</code></dt>
<dd><p>Decrypt text using AES-GCM</p>
</dd>
<dt><a href="#encryptCBC">encryptCBC(text, keyDerivationInfo, iv)</a> ⇒ <code><a href="#EncryptedComponents">Promise.&lt;EncryptedComponents&gt;</a></code></dt>
<dd><p>Encrypt text using AES-CBC</p>
</dd>
<dt><a href="#encryptGCM">encryptGCM(text, keyDerivationInfo, iv)</a> ⇒ <code><a href="#EncryptedComponents">Promise.&lt;EncryptedComponents&gt;</a></code></dt>
<dd><p>Encrypt text using AES-GCM</p>
</dd>
<dt><a href="#generateIV">generateIV()</a> ⇒ <code>Promise.&lt;Buffer&gt;</code></dt>
<dd><p>IV generator</p>
</dd>
<dt><a href="#generateSalt">generateSalt(length)</a> ⇒ <code>Promise.&lt;String&gt;</code></dt>
<dd><p>Salt generator</p>
</dd>
<dt><a href="#getConfiguration">getConfiguration()</a> ⇒ <code><a href="#Configuration">Configuration</a></code></dt>
<dd><p>Get the global configuration instance</p>
</dd>
<dt><a href="#configure">configure()</a> ⇒ <code><a href="#Configuration">Configuration</a></code></dt>
<dd><p>Configure global values</p>
</dd>
<dt><a href="#createSession">createSession()</a> ⇒ <code><a href="#Session">Session</a></code></dt>
<dd><p>Start new encryption/decryption session</p>
</dd>
<dt><a href="#packEncryptedContent">packEncryptedContent(encryptedContent, iv, salt, auth, rounds, method)</a> ⇒ <code>String</code></dt>
<dd><p>Pack encrypted content components into the final encrypted form</p>
</dd>
<dt><a href="#unpackEncryptedContent">unpackEncryptedContent(encryptedContent)</a> ⇒ <code><a href="#EncryptedComponents">EncryptedComponents</a></code></dt>
<dd><p>Unpack encrypted content components from an encrypted string</p>
</dd>
<dt><a href="#constantTimeCompare">constantTimeCompare(val1, val2)</a> ⇒ <code>Boolean</code></dt>
<dd><p>Compare 2 values using time-secure checks</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ConfigurationOptions">ConfigurationOptions</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#DerivedKeyInfo">DerivedKeyInfo</a></dt>
<dd><p>Derived key info</p>
</dd>
<dt><a href="#EncryptedComponents">EncryptedComponents</a> : <code>Object</code></dt>
<dd><p>Encrypted content components</p>
</dd>
<dt><a href="#EncryptedComponents">EncryptedComponents</a> : <code>Object</code></dt>
<dd><p>Encrypted content components</p>
</dd>
</dl>

<a name="module_iocane"></a>

## iocane
<a name="Configuration"></a>

## Configuration
System configuration

**Kind**: global class  

* [Configuration](#Configuration)
    * _instance_
        * [.options](#Configuration+options) : [<code>ConfigurationOptions</code>](#ConfigurationOptions)
        * [.overrideDecryption(method, [func])](#Configuration+overrideDecryption) ⇒ [<code>Configuration</code>](#Configuration)
        * [.overrideEncryption(method, [func])](#Configuration+overrideEncryption) ⇒ [<code>Configuration</code>](#Configuration)
        * [.overrideIVGeneration([func])](#Configuration+overrideIVGeneration) ⇒ [<code>Configuration</code>](#Configuration)
        * [.overrideKeyDerivation([func])](#Configuration+overrideKeyDerivation) ⇒ [<code>Configuration</code>](#Configuration)
        * [.overrideSaltGeneration([func])](#Configuration+overrideSaltGeneration) ⇒ [<code>Configuration</code>](#Configuration)
        * [.reset()](#Configuration+reset) ⇒ [<code>Configuration</code>](#Configuration)
        * [.setDerivationRounds([rounds])](#Configuration+setDerivationRounds) ⇒ [<code>Configuration</code>](#Configuration)
        * [.use(method)](#Configuration+use) ⇒ [<code>Configuration</code>](#Configuration)
    * _static_
        * [.getDefaultOptions()](#Configuration.getDefaultOptions) ⇒ [<code>ConfigurationOptions</code>](#ConfigurationOptions)

<a name="Configuration+options"></a>

### configuration.options : [<code>ConfigurationOptions</code>](#ConfigurationOptions)
Configuration options

**Kind**: instance property of [<code>Configuration</code>](#Configuration)  
**Read only**: true  
<a name="Configuration+overrideDecryption"></a>

### configuration.overrideDecryption(method, [func]) ⇒ [<code>Configuration</code>](#Configuration)
Override the decryption method

**Kind**: instance method of [<code>Configuration</code>](#Configuration)  
**Returns**: [<code>Configuration</code>](#Configuration) - Returns self  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>String</code> | Which encryption type to override (cbc/gcm) |
| [func] | <code>function</code> | A decryption function that should resemble that in the example |

**Example**  
```js
config.overrideDecryption("cbc", (encryptedComponents, keyDerivationInfo) => {
   // handle decryption
   // return Promise
 });
```
<a name="Configuration+overrideEncryption"></a>

### configuration.overrideEncryption(method, [func]) ⇒ [<code>Configuration</code>](#Configuration)
Override the encryption method

**Kind**: instance method of [<code>Configuration</code>](#Configuration)  
**Returns**: [<code>Configuration</code>](#Configuration) - Returns self  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>String</code> | Which encryption type to override (cbc/gcm) |
| [func] | <code>function</code> | A encryption function that should resemble that in the example |

**Example**  
```js
config.overrideEncryption("cbc", (text, keyDerivationInfo, ivBuffer) => {
   // handle encryption
   // return Promise
 });
```
<a name="Configuration+overrideIVGeneration"></a>

### configuration.overrideIVGeneration([func]) ⇒ [<code>Configuration</code>](#Configuration)
Override the IV generator

**Kind**: instance method of [<code>Configuration</code>](#Configuration)  
**Returns**: [<code>Configuration</code>](#Configuration) - Returns self  

| Param | Type | Description |
| --- | --- | --- |
| [func] | <code>function</code> | The override function |

**Example**  
```js
config.overrideIVGeneration(() => {
   return Promise.resolve(ivBuffer);
 });
```
<a name="Configuration+overrideKeyDerivation"></a>

### configuration.overrideKeyDerivation([func]) ⇒ [<code>Configuration</code>](#Configuration)
Override key derivation
Derive the key according to the `pbkdf2` function in derivation.js

**Kind**: instance method of [<code>Configuration</code>](#Configuration)  
**Returns**: [<code>Configuration</code>](#Configuration) - Returns self  

| Param | Type | Description |
| --- | --- | --- |
| [func] | <code>function</code> | The new key derivation function |

**Example**  
```js
config.overrideKeyDerivation((password, salt, rounds, bits) => {
   return Promise.resolve(derivedKeyBuffer);
 });
```
<a name="Configuration+overrideSaltGeneration"></a>

### configuration.overrideSaltGeneration([func]) ⇒ [<code>Configuration</code>](#Configuration)
Override salt generation

**Kind**: instance method of [<code>Configuration</code>](#Configuration)  
**Returns**: [<code>Configuration</code>](#Configuration) - Returns self  

| Param | Type | Description |
| --- | --- | --- |
| [func] | <code>function</code> | The function to use for salt generation |

**Example**  
```js
config.overrideSaltGeneration(length => {
   return Promise.resolve(saltText);
 });
```
<a name="Configuration+reset"></a>

### configuration.reset() ⇒ [<code>Configuration</code>](#Configuration)
Reset the configuration options

**Kind**: instance method of [<code>Configuration</code>](#Configuration)  
**Returns**: [<code>Configuration</code>](#Configuration) - Returns self  
<a name="Configuration+setDerivationRounds"></a>

### configuration.setDerivationRounds([rounds]) ⇒ [<code>Configuration</code>](#Configuration)
Set the derivation rounds to use

**Kind**: instance method of [<code>Configuration</code>](#Configuration)  
**Returns**: [<code>Configuration</code>](#Configuration) - Returns self  

| Param | Type | Description |
| --- | --- | --- |
| [rounds] | <code>Number</code> | The new rounds to use (empty for reset) |

<a name="Configuration+use"></a>

### configuration.use(method) ⇒ [<code>Configuration</code>](#Configuration)
Set the encryption method to use

**Kind**: instance method of [<code>Configuration</code>](#Configuration)  
**Returns**: [<code>Configuration</code>](#Configuration) - Returns self  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>String</code> | The method to use (cbc/gcm) |

<a name="Configuration.getDefaultOptions"></a>

### Configuration.getDefaultOptions() ⇒ [<code>ConfigurationOptions</code>](#ConfigurationOptions)
Get the default options

**Kind**: static method of [<code>Configuration</code>](#Configuration)  
**Returns**: [<code>ConfigurationOptions</code>](#ConfigurationOptions) - Default configuration options  
<a name="Session"></a>

## Session ⇐ [<code>Configuration</code>](#Configuration)
Encryption session

**Kind**: global class  
**Extends**: [<code>Configuration</code>](#Configuration)  

* [Session](#Session) ⇐ [<code>Configuration</code>](#Configuration)
    * [.options](#Configuration+options) : [<code>ConfigurationOptions</code>](#ConfigurationOptions)
    * [.decrypt(text, password)](#Session+decrypt)
    * [.encrypt(text, password)](#Session+encrypt) ⇒ <code>Promise.&lt;String&gt;</code>
    * [._deriveKey(password, salt, [rounds], [encryptionMethod])](#Session+_deriveKey) ⇒ [<code>Promise.&lt;DerivedKeyInfo&gt;</code>](#DerivedKeyInfo)
    * [._deriveNewKey(password)](#Session+_deriveNewKey) ⇒ [<code>Promise.&lt;DerivedKeyInfo&gt;</code>](#DerivedKeyInfo)
    * [.overrideDecryption(method, [func])](#Configuration+overrideDecryption) ⇒ [<code>Configuration</code>](#Configuration)
    * [.overrideEncryption(method, [func])](#Configuration+overrideEncryption) ⇒ [<code>Configuration</code>](#Configuration)
    * [.overrideIVGeneration([func])](#Configuration+overrideIVGeneration) ⇒ [<code>Configuration</code>](#Configuration)
    * [.overrideKeyDerivation([func])](#Configuration+overrideKeyDerivation) ⇒ [<code>Configuration</code>](#Configuration)
    * [.overrideSaltGeneration([func])](#Configuration+overrideSaltGeneration) ⇒ [<code>Configuration</code>](#Configuration)
    * [.reset()](#Configuration+reset) ⇒ [<code>Configuration</code>](#Configuration)
    * [.setDerivationRounds([rounds])](#Configuration+setDerivationRounds) ⇒ [<code>Configuration</code>](#Configuration)
    * [.use(method)](#Configuration+use) ⇒ [<code>Configuration</code>](#Configuration)

<a name="Configuration+options"></a>

### session.options : [<code>ConfigurationOptions</code>](#ConfigurationOptions)
Configuration options

**Kind**: instance property of [<code>Session</code>](#Session)  
**Read only**: true  
<a name="Session+decrypt"></a>

### session.decrypt(text, password)
Decrypt some text

**Kind**: instance method of [<code>Session</code>](#Session)  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>String</code> | The text to decrypt |
| password | <code>String</code> | The password to use for decryption |

<a name="Session+encrypt"></a>

### session.encrypt(text, password) ⇒ <code>Promise.&lt;String&gt;</code>
Encrypt some text

**Kind**: instance method of [<code>Session</code>](#Session)  
**Returns**: <code>Promise.&lt;String&gt;</code> - A promise that resolves with encrypted text  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>String</code> | The text to encrypt |
| password | <code>String</code> | The password to use for encryption |

<a name="Session+_deriveKey"></a>

### session._deriveKey(password, salt, [rounds], [encryptionMethod]) ⇒ [<code>Promise.&lt;DerivedKeyInfo&gt;</code>](#DerivedKeyInfo)
Derive a key using the current configuration

**Kind**: instance method of [<code>Session</code>](#Session)  
**Returns**: [<code>Promise.&lt;DerivedKeyInfo&gt;</code>](#DerivedKeyInfo) - Derived key information  
**Access**: protected  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>String</code> | The password |
| salt | <code>String</code> | The salt |
| [rounds] | <code>Number</code> | Key derivation rounds |
| [encryptionMethod] | <code>String</code> | Encryption method |

<a name="Session+_deriveNewKey"></a>

### session._deriveNewKey(password) ⇒ [<code>Promise.&lt;DerivedKeyInfo&gt;</code>](#DerivedKeyInfo)
Derive a new key using the current configuration

**Kind**: instance method of [<code>Session</code>](#Session)  
**Returns**: [<code>Promise.&lt;DerivedKeyInfo&gt;</code>](#DerivedKeyInfo) - Derived key information  
**Access**: protected  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>String</code> | The password |

<a name="Configuration+overrideDecryption"></a>

### session.overrideDecryption(method, [func]) ⇒ [<code>Configuration</code>](#Configuration)
Override the decryption method

**Kind**: instance method of [<code>Session</code>](#Session)  
**Returns**: [<code>Configuration</code>](#Configuration) - Returns self  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>String</code> | Which encryption type to override (cbc/gcm) |
| [func] | <code>function</code> | A decryption function that should resemble that in the example |

**Example**  
```js
config.overrideDecryption("cbc", (encryptedComponents, keyDerivationInfo) => {
   // handle decryption
   // return Promise
 });
```
<a name="Configuration+overrideEncryption"></a>

### session.overrideEncryption(method, [func]) ⇒ [<code>Configuration</code>](#Configuration)
Override the encryption method

**Kind**: instance method of [<code>Session</code>](#Session)  
**Returns**: [<code>Configuration</code>](#Configuration) - Returns self  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>String</code> | Which encryption type to override (cbc/gcm) |
| [func] | <code>function</code> | A encryption function that should resemble that in the example |

**Example**  
```js
config.overrideEncryption("cbc", (text, keyDerivationInfo, ivBuffer) => {
   // handle encryption
   // return Promise
 });
```
<a name="Configuration+overrideIVGeneration"></a>

### session.overrideIVGeneration([func]) ⇒ [<code>Configuration</code>](#Configuration)
Override the IV generator

**Kind**: instance method of [<code>Session</code>](#Session)  
**Returns**: [<code>Configuration</code>](#Configuration) - Returns self  

| Param | Type | Description |
| --- | --- | --- |
| [func] | <code>function</code> | The override function |

**Example**  
```js
config.overrideIVGeneration(() => {
   return Promise.resolve(ivBuffer);
 });
```
<a name="Configuration+overrideKeyDerivation"></a>

### session.overrideKeyDerivation([func]) ⇒ [<code>Configuration</code>](#Configuration)
Override key derivation
Derive the key according to the `pbkdf2` function in derivation.js

**Kind**: instance method of [<code>Session</code>](#Session)  
**Returns**: [<code>Configuration</code>](#Configuration) - Returns self  

| Param | Type | Description |
| --- | --- | --- |
| [func] | <code>function</code> | The new key derivation function |

**Example**  
```js
config.overrideKeyDerivation((password, salt, rounds, bits) => {
   return Promise.resolve(derivedKeyBuffer);
 });
```
<a name="Configuration+overrideSaltGeneration"></a>

### session.overrideSaltGeneration([func]) ⇒ [<code>Configuration</code>](#Configuration)
Override salt generation

**Kind**: instance method of [<code>Session</code>](#Session)  
**Returns**: [<code>Configuration</code>](#Configuration) - Returns self  

| Param | Type | Description |
| --- | --- | --- |
| [func] | <code>function</code> | The function to use for salt generation |

**Example**  
```js
config.overrideSaltGeneration(length => {
   return Promise.resolve(saltText);
 });
```
<a name="Configuration+reset"></a>

### session.reset() ⇒ [<code>Configuration</code>](#Configuration)
Reset the configuration options

**Kind**: instance method of [<code>Session</code>](#Session)  
**Returns**: [<code>Configuration</code>](#Configuration) - Returns self  
<a name="Configuration+setDerivationRounds"></a>

### session.setDerivationRounds([rounds]) ⇒ [<code>Configuration</code>](#Configuration)
Set the derivation rounds to use

**Kind**: instance method of [<code>Session</code>](#Session)  
**Returns**: [<code>Configuration</code>](#Configuration) - Returns self  

| Param | Type | Description |
| --- | --- | --- |
| [rounds] | <code>Number</code> | The new rounds to use (empty for reset) |

<a name="Configuration+use"></a>

### session.use(method) ⇒ [<code>Configuration</code>](#Configuration)
Set the encryption method to use

**Kind**: instance method of [<code>Session</code>](#Session)  
**Returns**: [<code>Configuration</code>](#Configuration) - Returns self  

| Param | Type | Description |
| --- | --- | --- |
| method | <code>String</code> | The method to use (cbc/gcm) |

<a name="deriveFromPassword"></a>

## deriveFromPassword(pbkdf2Gen, password, salt, rounds, [generateHMAC]) ⇒ [<code>Promise.&lt;DerivedKeyInfo&gt;</code>](#DerivedKeyInfo)
Derive a key from a password

**Kind**: global function  
**Returns**: [<code>Promise.&lt;DerivedKeyInfo&gt;</code>](#DerivedKeyInfo) - A promise that resolves with an object (DerivedKeyInfo)  
**Throws**:

- <code>Error</code> Rejects if no password is provided
- <code>Error</code> Rejects if no salt is provided
- <code>Error</code> Rejects if no rounds are provided


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| pbkdf2Gen | <code>function</code> |  | The generator method |
| password | <code>String</code> |  | The password to derive from |
| salt | <code>String</code> |  | The salt (Optional) |
| rounds | <code>Number</code> |  | The number of iterations |
| [generateHMAC] | <code>Boolean</code> | <code>true</code> | Enable HMAC key generation |

<a name="pbkdf2"></a>

## pbkdf2(password, salt, rounds, bits) ⇒ <code>Promise.&lt;Buffer&gt;</code>
The default PBKDF2 function

**Kind**: global function  
**Returns**: <code>Promise.&lt;Buffer&gt;</code> - A Promise that resolves with the hash  

| Param | Type | Description |
| --- | --- | --- |
| password | <code>String</code> | The password to use |
| salt | <code>String</code> | The salt to use |
| rounds | <code>Number</code> | The number of iterations |
| bits | <code>Number</code> | The size of the key to generate, in bits |

<a name="decryptCBC"></a>

## decryptCBC(encryptedComponents, keyDerivationInfo) ⇒ <code>Promise.&lt;String&gt;</code>
Decrypt text using AES-CBC

**Kind**: global function  
**Returns**: <code>Promise.&lt;String&gt;</code> - A promise that resolves with the decrypted string  

| Param | Type | Description |
| --- | --- | --- |
| encryptedComponents | [<code>EncryptedComponents</code>](#EncryptedComponents) | Encrypted components |
| keyDerivationInfo | [<code>DerivedKeyInfo</code>](#DerivedKeyInfo) | Key derivation information |

<a name="decryptGCM"></a>

## decryptGCM(encryptedComponents, keyDerivationInfo) ⇒ <code>Promise.&lt;String&gt;</code>
Decrypt text using AES-GCM

**Kind**: global function  
**Returns**: <code>Promise.&lt;String&gt;</code> - A promise that resolves with the decrypted string  

| Param | Type | Description |
| --- | --- | --- |
| encryptedComponents | [<code>EncryptedComponents</code>](#EncryptedComponents) | Encrypted components |
| keyDerivationInfo | [<code>DerivedKeyInfo</code>](#DerivedKeyInfo) | Key derivation information |

<a name="encryptCBC"></a>

## encryptCBC(text, keyDerivationInfo, iv) ⇒ [<code>Promise.&lt;EncryptedComponents&gt;</code>](#EncryptedComponents)
Encrypt text using AES-CBC

**Kind**: global function  
**Returns**: [<code>Promise.&lt;EncryptedComponents&gt;</code>](#EncryptedComponents) - A promise that resolves with encrypted components  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>String</code> | The text to encrypt |
| keyDerivationInfo | [<code>DerivedKeyInfo</code>](#DerivedKeyInfo) | Key derivation information |
| iv | <code>Buffer</code> | A buffer containing the IV |

<a name="encryptGCM"></a>

## encryptGCM(text, keyDerivationInfo, iv) ⇒ [<code>Promise.&lt;EncryptedComponents&gt;</code>](#EncryptedComponents)
Encrypt text using AES-GCM

**Kind**: global function  
**Returns**: [<code>Promise.&lt;EncryptedComponents&gt;</code>](#EncryptedComponents) - A promise that resolves with encrypted components  

| Param | Type | Description |
| --- | --- | --- |
| text | <code>String</code> | The text to encrypt |
| keyDerivationInfo | [<code>DerivedKeyInfo</code>](#DerivedKeyInfo) | Key derivation information |
| iv | <code>Buffer</code> | A buffer containing the IV |

<a name="generateIV"></a>

## generateIV() ⇒ <code>Promise.&lt;Buffer&gt;</code>
IV generator

**Kind**: global function  
**Returns**: <code>Promise.&lt;Buffer&gt;</code> - A promise that resolves with an IV  
<a name="generateSalt"></a>

## generateSalt(length) ⇒ <code>Promise.&lt;String&gt;</code>
Salt generator

**Kind**: global function  
**Returns**: <code>Promise.&lt;String&gt;</code> - A promise that resolves with a salt (hex)  
**Throws**:

- <code>Error</code> Rejects if length is invalid


| Param | Type | Description |
| --- | --- | --- |
| length | <code>Number</code> | The length of the string to generate |

<a name="getConfiguration"></a>

## getConfiguration() ⇒ [<code>Configuration</code>](#Configuration)
Get the global configuration instance

**Kind**: global function  
**Returns**: [<code>Configuration</code>](#Configuration) - The shared, global configuration instance  
<a name="configure"></a>

## configure() ⇒ [<code>Configuration</code>](#Configuration)
Configure global values

**Kind**: global function  
**Returns**: [<code>Configuration</code>](#Configuration) - The global configuration instance  
<a name="createSession"></a>

## createSession() ⇒ [<code>Session</code>](#Session)
Start new encryption/decryption session

**Kind**: global function  
**Returns**: [<code>Session</code>](#Session) - New crypto session  
<a name="packEncryptedContent"></a>

## packEncryptedContent(encryptedContent, iv, salt, auth, rounds, method) ⇒ <code>String</code>
Pack encrypted content components into the final encrypted form

**Kind**: global function  
**Returns**: <code>String</code> - The final encrypted form  

| Param | Type | Description |
| --- | --- | --- |
| encryptedContent | <code>String</code> | The encrypted text |
| iv | <code>String</code> | The IV in hex form |
| salt | <code>String</code> | The salt |
| auth | <code>String</code> | The HMAC for CBC mode, or the authentication tag for GCM mode |
| rounds | <code>Number</code> | The PBKDF2 round count |
| method | <code>String</code> | The encryption method (cbc/gcm) |

<a name="unpackEncryptedContent"></a>

## unpackEncryptedContent(encryptedContent) ⇒ [<code>EncryptedComponents</code>](#EncryptedComponents)
Unpack encrypted content components from an encrypted string

**Kind**: global function  
**Returns**: [<code>EncryptedComponents</code>](#EncryptedComponents) - The extracted components  
**Throws**:

- <code>Error</code> Throws if the number of components is incorrect


| Param | Type | Description |
| --- | --- | --- |
| encryptedContent | <code>String</code> | The encrypted string |

<a name="constantTimeCompare"></a>

## constantTimeCompare(val1, val2) ⇒ <code>Boolean</code>
Compare 2 values using time-secure checks

**Kind**: global function  
**Returns**: <code>Boolean</code> - True if the values match  

| Param | Type | Description |
| --- | --- | --- |
| val1 | <code>String</code> | A value |
| val2 | <code>String</code> | Another value |

<a name="ConfigurationOptions"></a>

## ConfigurationOptions : <code>Object</code>
**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| decryption_cbc | <code>function</code> | The CBC decryption method |
| decryption_gcm | <code>function</code> | The GCM decryption method |
| derivationRounds | <code>Number</code> | The number of key derivation iterations |
| deriveKey | <code>function</code> | The key derivation function (default: PBKDF2) |
| encryption_cbc | <code>function</code> | The CBC encryption method |
| encryption_gcm | <code>function</code> | The GCM encryption method |
| generateIV | <code>function</code> | The IV generation method |
| generateSalt | <code>function</code> | The salt generation method |
| method | <code>String</code> | The encryption method (cbc/gcm) |
| saltLength | <code>Number</code> | The length of the salt |

<a name="DerivedKeyInfo"></a>

## DerivedKeyInfo
Derived key info

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| salt | <code>String</code> | The salt used |
| key | <code>Buffer</code> | The derived key |
| hmac | <code>Buffer</code> | The HMAC |
| rounds | <code>Number</code> | The number of rounds used |

<a name="EncryptedComponents"></a>

## EncryptedComponents : <code>Object</code>
Encrypted content components

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| content | <code>String</code> | The encrypted string |
| iv | <code>String</code> | The IV in hex form |
| salt | <code>String</code> | The salt |
| auth | <code>String</code> | The HMAC in hex form for CBC, or tag in hex form for GCM |
| rounds | <code>Number</code> | The PBKDF2 rounds |
| method | <code>String</code> | The encryption method (gcm/cbc) |

<a name="EncryptedComponents"></a>

## EncryptedComponents : <code>Object</code>
Encrypted content components

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| content | <code>String</code> | The encrypted string |
| iv | <code>String</code> | The IV in hex form |
| salt | <code>String</code> | The salt |
| hmac | <code>String</code> | The HMAC in hex form |
| rounds | <code>Number</code> | The PBKDF2 rounds |
| method | <code>String</code> | The encryption method (cbc/gcm) |

