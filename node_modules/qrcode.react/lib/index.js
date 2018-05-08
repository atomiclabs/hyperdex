'use strict';

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var React = require('react');

var PropTypes = require('prop-types'); // qr.js doesn't handle error level of zero (M) so we need to do it right,
// thus the deep require.


var QRCodeImpl = require('qr.js/lib/QRCode');

var ErrorCorrectLevel = require('qr.js/lib/ErrorCorrectLevel');

function getBackingStorePixelRatio(ctx) {
  return (// $FlowFixMe
    ctx.webkitBackingStorePixelRatio || // $FlowFixMe
    ctx.mozBackingStorePixelRatio || // $FlowFixMe
    ctx.msBackingStorePixelRatio || // $FlowFixMe
    ctx.oBackingStorePixelRatio || // $FlowFixMe
    ctx.backingStorePixelRatio || 1
  );
} // Convert from UTF-16, forcing the use of byte-mode encoding in our QR Code.
// This allows us to encode Hanji, Kanji, emoji, etc. Ideally we'd do more
// detection and not resort to byte-mode if possible, but we're trading off
// a smaller library for a smaller amount of data we can potentially encode.
// Based on http://jonisalonen.com/2012/from-utf-16-to-utf-8-in-javascript/


function convertStr(str) {
  var out = '';

  for (var i = 0; i < str.length; i++) {
    var charcode = str.charCodeAt(i);

    if (charcode < 0x0080) {
      out += String.fromCharCode(charcode);
    } else if (charcode < 0x0800) {
      out += String.fromCharCode(0xc0 | charcode >> 6);
      out += String.fromCharCode(0x80 | charcode & 0x3f);
    } else if (charcode < 0xd800 || charcode >= 0xe000) {
      out += String.fromCharCode(0xe0 | charcode >> 12);
      out += String.fromCharCode(0x80 | charcode >> 6 & 0x3f);
      out += String.fromCharCode(0x80 | charcode & 0x3f);
    } else {
      // This is a surrogate pair, so we'll reconsitute the pieces and work
      // from that
      i++;
      charcode = 0x10000 + ((charcode & 0x3ff) << 10 | str.charCodeAt(i) & 0x3ff);
      out += String.fromCharCode(0xf0 | charcode >> 18);
      out += String.fromCharCode(0x80 | charcode >> 12 & 0x3f);
      out += String.fromCharCode(0x80 | charcode >> 6 & 0x3f);
      out += String.fromCharCode(0x80 | charcode & 0x3f);
    }
  }

  return out;
}

var DEFAULT_PROPS = {
  size: 128,
  level: 'L',
  bgColor: '#FFFFFF',
  fgColor: '#000000'
};
var PROP_TYPES = {
  value: PropTypes.string.isRequired,
  size: PropTypes.number,
  level: PropTypes.oneOf(['L', 'M', 'Q', 'H']),
  bgColor: PropTypes.string,
  fgColor: PropTypes.string
};

var QRCodeCanvas =
/*#__PURE__*/
function (_React$Component) {
  _inherits(QRCodeCanvas, _React$Component);

  function QRCodeCanvas() {
    var _ref;

    var _temp, _this;

    _classCallCheck(this, QRCodeCanvas);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _possibleConstructorReturn(_this, (_temp = _this = _possibleConstructorReturn(this, (_ref = QRCodeCanvas.__proto__ || Object.getPrototypeOf(QRCodeCanvas)).call.apply(_ref, [this].concat(args))), Object.defineProperty(_assertThisInitialized(_this), "_canvas", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: void 0
    }), _temp));
  }

  _createClass(QRCodeCanvas, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      var _this2 = this;

      return Object.keys(QRCodeCanvas.propTypes).some(function (k) {
        return _this2.props[k] !== nextProps[k];
      });
    }
  }, {
    key: "componentDidMount",
    value: function componentDidMount() {
      this.update();
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      this.update();
    }
  }, {
    key: "update",
    value: function update() {
      var _props = this.props,
          value = _props.value,
          size = _props.size,
          level = _props.level,
          bgColor = _props.bgColor,
          fgColor = _props.fgColor; // We'll use type===-1 to force QRCode to automatically pick the best type

      var qrcode = new QRCodeImpl(-1, ErrorCorrectLevel[level]);
      qrcode.addData(convertStr(value));
      qrcode.make();

      if (this._canvas != null) {
        var canvas = this._canvas;
        var ctx = canvas.getContext('2d');

        if (!ctx) {
          return;
        }

        var cells = qrcode.modules;

        if (cells === null) {
          return;
        }

        var tileW = size / cells.length;
        var tileH = size / cells.length;
        var scale = (window.devicePixelRatio || 1) / getBackingStorePixelRatio(ctx);
        canvas.height = canvas.width = size * scale;
        ctx.scale(scale, scale);
        cells.forEach(function (row, rdx) {
          row.forEach(function (cell, cdx) {
            ctx && (ctx.fillStyle = cell ? fgColor : bgColor);
            var w = Math.ceil((cdx + 1) * tileW) - Math.floor(cdx * tileW);
            var h = Math.ceil((rdx + 1) * tileH) - Math.floor(rdx * tileH);
            ctx && ctx.fillRect(Math.round(cdx * tileW), Math.round(rdx * tileH), w, h);
          });
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this3 = this;

      var _props2 = this.props,
          value = _props2.value,
          size = _props2.size,
          level = _props2.level,
          bgColor = _props2.bgColor,
          fgColor = _props2.fgColor,
          style = _props2.style,
          otherProps = _objectWithoutProperties(_props2, ["value", "size", "level", "bgColor", "fgColor", "style"]);

      var canvasStyle = _extends({
        height: size,
        width: size
      }, style);

      return React.createElement("canvas", _extends({
        style: canvasStyle,
        height: size,
        width: size,
        ref: function ref(_ref2) {
          return _this3._canvas = _ref2;
        }
      }, otherProps));
    }
  }]);

  return QRCodeCanvas;
}(React.Component);

Object.defineProperty(QRCodeCanvas, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: DEFAULT_PROPS
});
Object.defineProperty(QRCodeCanvas, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: PROP_TYPES
});

var QRCodeSVG =
/*#__PURE__*/
function (_React$Component2) {
  _inherits(QRCodeSVG, _React$Component2);

  function QRCodeSVG() {
    _classCallCheck(this, QRCodeSVG);

    return _possibleConstructorReturn(this, (QRCodeSVG.__proto__ || Object.getPrototypeOf(QRCodeSVG)).apply(this, arguments));
  }

  _createClass(QRCodeSVG, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps) {
      var _this4 = this;

      return Object.keys(QRCodeCanvas.propTypes).some(function (k) {
        return _this4.props[k] !== nextProps[k];
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _props3 = this.props,
          value = _props3.value,
          size = _props3.size,
          level = _props3.level,
          bgColor = _props3.bgColor,
          fgColor = _props3.fgColor,
          otherProps = _objectWithoutProperties(_props3, ["value", "size", "level", "bgColor", "fgColor"]); // We'll use type===-1 to force QRCode to automatically pick the best type


      var qrcode = new QRCodeImpl(-1, ErrorCorrectLevel[level]);
      qrcode.addData(convertStr(value));
      qrcode.make();
      var cells = qrcode.modules;

      if (cells === null) {
        return;
      } // Drawing strategy: instead of a rect per module, we're going to create a
      // single path for the dark modules and layer that on top of a light rect,
      // for a total of 2 DOM nodes. We pay a bit more in string concat but that's
      // way faster than DOM ops.
      // For level 1, 441 nodes -> 2
      // For level 40, 31329 -> 2


      var ops = [];
      cells.forEach(function (row, y) {
        var lastIsDark = false;
        var start = null;
        row.forEach(function (cell, x) {
          if (!cell && start !== null) {
            // M0 0h7v1H0z injects the space with the move and dropd the comma,
            // saving a char per operation
            ops.push("M".concat(start, " ").concat(y, "h").concat(x - start, "v1H").concat(start, "z"));
            start = null;
            return;
          } // end of row, clean up or skip


          if (x === row.length - 1) {
            if (!cell) {
              // We would have closed the op above already so this can only mean
              // 2+ light modules in a row.
              return;
            }

            if (start === null) {
              // Just a single dark module.
              ops.push("M".concat(x, ",").concat(y, " h1v1H").concat(x, "z"));
            } else {
              // Otherwise finish the current line.
              ops.push("M".concat(start, ",").concat(y, " h").concat(x + 1 - start, "v1H").concat(start, "z"));
            }

            return;
          }

          if (cell && start === null) {
            start = x;
          }
        });
      });
      return React.createElement("svg", _extends({
        shapeRendering: "crispEdges",
        height: size,
        width: size,
        viewBox: "0 0 ".concat(cells.length, " ").concat(cells.length)
      }, otherProps), React.createElement("path", {
        fill: bgColor,
        d: "M0,0 h".concat(cells.length, "v").concat(cells.length, "H0z")
      }), React.createElement("path", {
        fill: fgColor,
        d: ops.join('')
      }));
    }
  }]);

  return QRCodeSVG;
}(React.Component);

Object.defineProperty(QRCodeSVG, "defaultProps", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: DEFAULT_PROPS
});
Object.defineProperty(QRCodeSVG, "propTypes", {
  configurable: true,
  enumerable: true,
  writable: true,
  value: PROP_TYPES
});

var QRCode = function QRCode(props) {
  var renderAs = props.renderAs,
      otherProps = _objectWithoutProperties(props, ["renderAs"]);

  var Component = renderAs === 'svg' ? QRCodeSVG : QRCodeCanvas;
  return React.createElement(Component, otherProps);
};

QRCode.defaultProps = _extends({
  renderAs: 'canvas'
}, DEFAULT_PROPS);
module.exports = QRCode;