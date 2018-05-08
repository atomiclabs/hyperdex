# read-blob
Read [Blobs](https://developer.mozilla.org/en-US/docs/Web/API/Blob) (and [Files](https://developer.mozilla.org/en-US/docs/Web/API/File)) without going insane. Intended for use with browsers and environments that implement the File API.

Reading binary data in the browser with the native Filereader API is extremely clunky and un-nodelike.

`read-blob` fixes that by adding nice errback and Promise interfaces. The data in the blob is buffered into memory and provided as an arraybuffer, base64-encoded data url, or simple text.

If you'd rather not buffer and prefer a streaming interface, check out [filereader-stream](https://github.com/maxogden/filereader-stream). In contrast, `read-blob` is designed for more simple use-cases where streaming isn't necessary or is simply too much.

**If you do not provide a callback, `read-blob` will return a Promise. This means that you'll need a Promise implementation in your environment. Either polyfill `Promise`, or provide a callback.**

## Installation
`npm install --save read-blob`

If using `require` through something like browserify or webpack is not an option for you, use `dist/read-blob.js`
from the npm package and it will set readBlob on the global object.

## Example Usage and Comparison
```js
var readBlob = require('read-blob');

readBlob(blob, 'dataurl', function (err, dataurl) {
  if (err) throw err;

  console.log('that was simple!');
  img.src = dataurl;
});
```

In contrast, using the native FileReader API would look like this:

```js
var reader = new FileReader();

reader.onload = function (res) {
  console.log('that was not so simple!');
  img.src = dataurl;
}

reader.onend = function (err) {
  throw err;
}

reader.onabort = function (err) {
  throw err;
}

reader.readAsDataURL(blob);
```

Ew! Not only is the native API much longer, but it doesn't *say* what it does, and instead leaks all the procedure of the Filereader API into *your* program.

## API

### `readBlob(blob, type, cb)`
Reads the blob data as the given `type`. Type can be `dataurl`, `arraybuffer`, `text`, or any text encoding such as 'utf8' (though `text` defaults to utf-8 just as it does in native API).

If `type` is not provided, it defaults to `arraybuffer`.
`cb` is a function of the signature `function (err, data)`

### `readBlob(blob, type)`
Like the version with `cb`, but if no callback function is provided, returns a Promise that resolves to the blob's data in the requested `type`.

If `type` is not provided, it defaults to `arraybuffer`.

### Shorthands

`readBlob.dataurl(blob)`, `readBlob.arraybuffer(blob)`, and `readBlob.text(blob)` are all shorthands for reading the blob as the given type.

Combined with their Promise-returning versions, reading a blob becomes quite succinct:
```js
readBlob.dataurl(blob).then(url => # data:image/jpeg;base64,...)
```
