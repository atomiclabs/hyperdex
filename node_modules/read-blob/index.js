/* global FileReader, Blob */

var methods = {
  arraybuffer: 'readAsArrayBuffer',
  dataurl: 'readAsDataURL',
  text: 'readAsText'
};

function readBlob (blob, type, cb) {
  var promise;

  if (typeof type !== 'string') {
    cb = type;
    type = 'arraybuffer';
  }

  if (!(blob instanceof Blob)) {
    var err = new Error('first argument is not a blob');
    if (cb) {
      cb(err);
      return;
    } else {
      return Promise.reject(err);
    }
  }

  if (!cb) {
    promise = new Promise(function (resolve, reject) {
      cb = function (err, result) {
        if (err) reject(err);
        else resolve(result);
      };
    });
  }

  var method = methods[type.toLowerCase()];
  var reader = new FileReader();

  reader.addEventListener('loadend', function onend (e) {
    reader.removeEventListener('loadend', onend);
    if (e.error) {
      cb(e.error);
    } else {
      cb(null, reader.result);
    }
  });

  if (method) {
    reader[method](blob);
  } else {
    // assume the output value is a text encoding
    reader.readAsText(blob, type);
  }

  return promise;
}

module.exports = readBlob;

// add arraybuffer, dataurl, and text methods
// as aliases to their options counterpart
Object.keys(methods).forEach(function (type) {
  readBlob[type] = function (blob, cb) {
    return readBlob(blob, type, cb);
  };
});
