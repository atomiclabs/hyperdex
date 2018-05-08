"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = transformFileSync;

function _fs() {
  var data = _interopRequireDefault(require("fs"));

  _fs = function _fs() {
    return data;
  };

  return data;
}

var _config = _interopRequireDefault(require("./config"));

var _transformation = require("./transformation");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function transformFileSync(filename, opts) {
  var options;

  if (opts == null) {
    options = {
      filename: filename
    };
  } else if (opts && typeof opts === "object") {
    options = Object.assign({}, opts, {
      filename: filename
    });
  }

  var config = (0, _config.default)(options);
  if (config === null) return null;
  return (0, _transformation.runSync)(config, _fs().default.readFileSync(filename, "utf8"));
}