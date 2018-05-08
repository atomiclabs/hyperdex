(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["RechartsScale"] = factory();
	else
		root["RechartsScale"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getNiceTickValues = __webpack_require__(2);

	Object.defineProperty(exports, 'getTickValues', {
	  enumerable: true,
	  get: function get() {
	    return _getNiceTickValues.getTickValues;
	  }
	});
	Object.defineProperty(exports, 'getNiceTickValues', {
	  enumerable: true,
	  get: function get() {
	    return _getNiceTickValues.getNiceTickValues;
	  }
	});
	Object.defineProperty(exports, 'getTickValuesFixedDomain', {
	  enumerable: true,
	  get: function get() {
	    return _getNiceTickValues.getTickValuesFixedDomain;
	  }
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	var identity = function identity(i) {
	  return i;
	};

	var PLACE_HOLDER = exports.PLACE_HOLDER = {
	  '@@functional/placeholder': true
	};

	var isPlaceHolder = function isPlaceHolder(val) {
	  return val === PLACE_HOLDER;
	};

	var curry0 = function curry0(fn) {
	  return function _curried() {
	    if (arguments.length === 0 || arguments.length === 1 && isPlaceHolder(arguments.length <= 0 ? undefined : arguments[0])) {
	      return _curried;
	    }

	    return fn.apply(undefined, arguments);
	  };
	};

	var curryN = function curryN(n, fn) {
	  if (n === 1) {
	    return fn;
	  }

	  return curry0(function () {
	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    var argsLength = args.filter(function (arg) {
	      return arg !== PLACE_HOLDER;
	    }).length;

	    if (argsLength >= n) {
	      return fn.apply(undefined, args);
	    }

	    return curryN(n - argsLength, curry0(function () {
	      for (var _len2 = arguments.length, restArgs = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
	        restArgs[_key2] = arguments[_key2];
	      }

	      var newArgs = args.map(function (arg) {
	        return isPlaceHolder(arg) ? restArgs.shift() : arg;
	      });

	      return fn.apply(undefined, _toConsumableArray(newArgs).concat(restArgs));
	    }));
	  });
	};

	var curry = exports.curry = function curry(fn) {
	  return curryN(fn.length, fn);
	};

	var range = exports.range = function range(begin, end) {
	  var arr = [];

	  for (var i = begin; i < end; ++i) {
	    arr[i - begin] = i;
	  }

	  return arr;
	};

	var map = exports.map = curry(function (fn, arr) {
	  if (Array.isArray(arr)) {
	    return arr.map(fn);
	  }

	  return Object.keys(arr).map(function (key) {
	    return arr[key];
	  }).map(fn);
	});

	var compose = exports.compose = function compose() {
	  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
	    args[_key3] = arguments[_key3];
	  }

	  if (!args.length) {
	    return identity;
	  }

	  var fns = args.reverse();
	  // first function can receive multiply arguments
	  var firstFn = fns[0];
	  var tailsFn = fns.slice(1);

	  return function () {
	    return tailsFn.reduce(function (res, fn) {
	      return fn(res);
	    }, firstFn.apply(undefined, arguments));
	  };
	};

	var reverse = exports.reverse = function reverse(arr) {
	  if (Array.isArray(arr)) {
	    return arr.reverse();
	  }

	  // can be string
	  return arr.split('').reverse.join('');
	};

	var memoize = exports.memoize = function memoize(fn) {
	  var lastArgs = null;
	  var lastResult = null;

	  return function () {
	    for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
	      args[_key4] = arguments[_key4];
	    }

	    if (lastArgs && args.every(function (val, i) {
	      return val === lastArgs[i];
	    })) {
	      return lastResult;
	    }

	    lastArgs = args;
	    lastResult = fn.apply(undefined, args);

	    return lastResult;
	  };
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getTickValuesFixedDomain = exports.getTickValues = exports.getNiceTickValues = undefined;

	var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @fileOverview calculate tick values of scale
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @author xile611, arcthur
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * @date 2015-09-17
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

	var _utils = __webpack_require__(1);

	var _arithmetic = __webpack_require__(3);

	var _arithmetic2 = _interopRequireDefault(_arithmetic);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

	/**
	 * Calculate a interval of a minimum value and a maximum value
	 *
	 * @param  {Number} min       The minimum value
	 * @param  {Number} max       The maximum value
	 * @return {Array} An interval
	 */
	function getValidInterval(_ref) {
	  var _ref2 = _slicedToArray(_ref, 2),
	      min = _ref2[0],
	      max = _ref2[1];

	  var validMin = min,
	      validMax = max;

	  // exchange

	  if (min > max) {
	    validMin = max;
	    validMax = min;
	  }

	  return [validMin, validMax];
	}

	/**
	 * Calculate the step which is easy to understand between ticks, like 10, 20, 25
	 *
	 * @param  {Number}  roughStep        The rough step calculated by deviding the
	 * difference by the tickCount
	 * @param  {Boolean} allowDecimals    Allow the ticks to be decimals or not
	 * @param  {Integer} correctionFactor A correction factor
	 * @return {Number}  The step which is easy to understand between two ticks
	 */
	function getFormatStep(roughStep, allowDecimals, correctionFactor) {
	  if (roughStep <= 0) {
	    return 0;
	  }

	  var digitCount = _arithmetic2.default.getDigitCount(roughStep);
	  // The ratio between the rough step and the smallest number which has a bigger
	  // order of magnitudes than the rough step
	  var stepRatio = roughStep / Math.pow(10, digitCount);
	  // When an integer and a float multiplied, the accuracy of result may be wrong
	  var amendStepRatio = digitCount !== 1 ? _arithmetic2.default.multiply(Math.ceil(stepRatio / 0.05) + correctionFactor, 0.05) : _arithmetic2.default.multiply(Math.ceil(stepRatio / 0.1) + correctionFactor, 0.1);

	  var formatStep = _arithmetic2.default.multiply(amendStepRatio, Math.pow(10, digitCount));

	  return allowDecimals ? formatStep : Math.ceil(formatStep);
	}

	/**
	 * calculate the ticks when the minimum value equals to the maximum value
	 *
	 * @param  {Number}  value         The minimum valuue which is also the maximum value
	 * @param  {Integer} tickCount     The count of ticks
	 * @param  {Boolean} allowDecimals Allow the ticks to be decimals or not
	 * @return {Array}                 ticks
	 */
	function getTickOfSingleValue(value, tickCount, allowDecimals) {
	  var isFlt = _arithmetic2.default.isFloat(value);
	  var step = 1;
	  // calculate the middle value of ticks
	  var middle = value;

	  if (isFlt && allowDecimals) {
	    var absVal = Math.abs(value);

	    if (absVal < 1) {
	      // The step should be a float number when the difference is smaller than 1
	      step = Math.pow(10, _arithmetic2.default.getDigitCount(value) - 1);

	      middle = _arithmetic2.default.multiply(Math.floor(value / step), step);
	    } else if (absVal > 1) {
	      // Return the maximum integer which is smaller than 'value' when 'value' is greater than 1
	      middle = Math.floor(value);
	    }
	  } else if (value === 0) {
	    middle = Math.floor((tickCount - 1) / 2);
	  } else if (!allowDecimals) {
	    middle = Math.floor(value);
	  }

	  var middleIndex = Math.floor((tickCount - 1) / 2);

	  var fn = (0, _utils.compose)((0, _utils.map)(function (n) {
	    return _arithmetic2.default.sum(middle, _arithmetic2.default.multiply(n - middleIndex, step));
	  }), _utils.range);

	  return fn(0, tickCount);
	}

	/**
	 * Calculate the step
	 *
	 * @param  {Number}  min              The minimum value of an interval
	 * @param  {Number}  max              The maximum value of an interval
	 * @param  {Integer} tickCount        The count of ticks
	 * @param  {Boolean} allowDecimals    Allow the ticks to be decimals or not
	 * @param  {Number}  correctionFactor A correction factor
	 * @return {Object}  The step, minimum value of ticks, maximum value of ticks
	 */
	function calculateStep(min, max, tickCount, allowDecimals) {
	  var correctionFactor = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

	  // The step which is easy to understand between two ticks
	  var step = getFormatStep((max - min) / (tickCount - 1), allowDecimals, correctionFactor);

	  // A medial value of ticks
	  var middle = void 0;

	  // When 0 is inside the interval, 0 should be a tick
	  if (min <= 0 && max >= 0) {
	    middle = 0;
	  } else {
	    // calculate the middle value
	    middle = _arithmetic2.default.divide(_arithmetic2.default.sum(min, max), 2);
	    // minus modulo value
	    middle = _arithmetic2.default.minus(middle, _arithmetic2.default.modulo(middle, step));
	    // strip
	    middle = _arithmetic2.default.strip(middle, 16);
	  }

	  var belowCount = Math.ceil((middle - min) / step);
	  var upCount = Math.ceil((max - middle) / step);
	  var scaleCount = belowCount + upCount + 1;

	  if (scaleCount > tickCount) {
	    // When more ticks need to cover the interval, step should be bigger.
	    return calculateStep(min, max, tickCount, allowDecimals, correctionFactor + 1);
	  } else if (scaleCount < tickCount) {
	    // When less ticks can cover the interval, we should add some additional ticks
	    upCount = max > 0 ? upCount + (tickCount - scaleCount) : upCount;
	    belowCount = max > 0 ? belowCount : belowCount + (tickCount - scaleCount);
	  }

	  return {
	    step: step,
	    tickMin: _arithmetic2.default.minus(middle, _arithmetic2.default.multiply(belowCount, step)),
	    tickMax: _arithmetic2.default.sum(middle, _arithmetic2.default.multiply(upCount, step))
	  };
	}
	/**
	 * Calculate the ticks of an interval
	 *
	 * @param  {Number}  min, max      min: The minimum value, max: The maximum value
	 * @param  {Integer} tickCount     The count of ticks
	 * @param  {Boolean} allowDecimals Allow the ticks to be decimals or not
	 * @return {Array}   ticks
	 */
	function getNiceTickValuesFn(_ref3) {
	  var _ref4 = _slicedToArray(_ref3, 2),
	      min = _ref4[0],
	      max = _ref4[1];

	  var tickCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
	  var allowDecimals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

	  // More than two ticks should be return
	  var count = Math.max(tickCount, 2);

	  var _getValidInterval = getValidInterval([min, max]),
	      _getValidInterval2 = _slicedToArray(_getValidInterval, 2),
	      cormin = _getValidInterval2[0],
	      cormax = _getValidInterval2[1];

	  if (cormin === cormax) {
	    return getTickOfSingleValue(cormin, tickCount, allowDecimals);
	  }

	  // Get the step between two ticks

	  var _calculateStep = calculateStep(cormin, cormax, count, allowDecimals),
	      step = _calculateStep.step,
	      tickMin = _calculateStep.tickMin,
	      tickMax = _calculateStep.tickMax;

	  var values = _arithmetic2.default.rangeStep(tickMin, tickMax + 0.1 * step, step);

	  return min > max ? (0, _utils.reverse)(values) : values;
	}

	function getTickValuesFn(_ref5) {
	  var _ref6 = _slicedToArray(_ref5, 2),
	      min = _ref6[0],
	      max = _ref6[1];

	  var tickCount = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
	  var allowDecimals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

	  // More than two ticks should be return
	  var count = Math.max(tickCount, 2);

	  var _getValidInterval3 = getValidInterval([min, max]),
	      _getValidInterval4 = _slicedToArray(_getValidInterval3, 2),
	      cormin = _getValidInterval4[0],
	      cormax = _getValidInterval4[1];

	  if (cormin === cormax) {
	    return getTickOfSingleValue(cormin, tickCount, allowDecimals);
	  }

	  var step = getFormatStep((cormax - cormin) / (count - 1), allowDecimals, 0);

	  var fn = (0, _utils.compose)((0, _utils.map)(function (n) {
	    return cormin + n * step;
	  }), _utils.range);

	  var values = fn(0, count).filter(function (entry) {
	    return entry >= cormin && entry <= cormax;
	  });

	  return min > max ? (0, _utils.reverse)(values) : values;
	}

	function getTickValuesFixedDomainFn(_ref7, tickCount) {
	  var _ref8 = _slicedToArray(_ref7, 2),
	      min = _ref8[0],
	      max = _ref8[1];

	  var allowDecimals = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

	  // More than two ticks should be return
	  var _getValidInterval5 = getValidInterval([min, max]),
	      _getValidInterval6 = _slicedToArray(_getValidInterval5, 2),
	      cormin = _getValidInterval6[0],
	      cormax = _getValidInterval6[1];

	  if (cormin === cormax) {
	    return [cormin];
	  }

	  var count = Math.max(tickCount, 2);
	  var step = getFormatStep((cormax - cormin) / (count - 1), allowDecimals, 0);
	  var values = [].concat(_toConsumableArray(_arithmetic2.default.rangeStep(cormin, cormax - 0.99 * step, step)), [cormax]);

	  return min > max ? (0, _utils.reverse)(values) : values;
	}

	var getNiceTickValues = exports.getNiceTickValues = (0, _utils.memoize)(getNiceTickValuesFn);
	var getTickValues = exports.getTickValues = (0, _utils.memoize)(getTickValuesFn);
	var getTickValuesFixedDomain = exports.getTickValuesFixedDomain = (0, _utils.memoize)(getTickValuesFixedDomainFn);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _utils = __webpack_require__(1);

	/**
	 * 把错误的数据转正
	 * strip(0.09999999999999998)=0.1
	 * @param {Number} num       输入值
	 * @param {Number} precision 精度
	 * @return {Number} 数值
	 */
	function strip(num) {
	  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 12;

	  return +parseFloat(num.toPrecision(precision));
	}

	/**
	 * 判断数据是否为浮点类型
	 *
	 * @param {Number} num 输入值
	 * @return {Boolean} 是否是浮点类型
	 */
	/**
	 * @fileOverview 一些公用的运算方法
	 * @author xile611
	 * @date 2015-09-17
	 */
	function isFloat(num) {
	  return (/^([+-]?)\d*\.\d+$/.test(num)
	  );
	}

	/**
	 * 获取数值的位数
	 * 其中绝对值属于区间[0.1, 1)， 得到的值为0
	 * 绝对值属于区间[0.01, 0.1)，得到的位数为 -1
	 * 绝对值属于区间[0.001, 0.01)，得到的位数为 -2
	 *
	 * @param  {Number} value 数值
	 * @return {Integer} 位数
	 */
	function getDigitCount(value) {
	  var abs = Math.abs(value);
	  var result = void 0;

	  if (value === 0) {
	    result = 1;
	  } else {
	    result = Math.floor(Math.log(abs) / Math.log(10)) + 1;
	  }

	  return result;
	}
	/**
	 * 计算数值的小数点后的位数
	 * @param  {Number} a 数值，可能为整数，也可能为浮点数
	 * @return {Integer}   位数
	 */
	function getDecimalDigitCount(a) {
	  var str = a ? '' + a : '';

	  // scientific notation
	  if (str.indexOf('e') >= 0) {
	    return Math.abs(parseInt(str.slice(str.indexOf('e') + 1), 10));
	  }
	  var ary = str.split('.');

	  return ary.length > 1 ? ary[1].length : 0;
	}
	/**
	 * 乘法运算，解决了js运算的精度问题
	 * @param  {Number} a 被乘数
	 * @param  {Number} b 乘数
	 * @return {Number}   积
	 */
	function multiply(a, b) {
	  var intA = parseInt(('' + a).replace('.', ''), 10);
	  var intB = parseInt(('' + b).replace('.', ''), 10);
	  var count = getDecimalDigitCount(a) + getDecimalDigitCount(b);

	  return intA * intB / Math.pow(10, count);
	}
	/**
	 * 加法运算，解决了js运算的精度问题
	 * @param  {Number} a 被加数
	 * @param  {Number} b 加数
	 * @return {Number}   和
	 */
	function sum(a, b) {
	  var count = Math.max(getDecimalDigitCount(a), getDecimalDigitCount(b));

	  count = Math.pow(10, count);
	  return (multiply(a, count) + multiply(b, count)) / count;
	}
	/**
	 * 减法运算，解决了js运算的精度问题
	 * @param  {Number} a 被减数
	 * @param  {Number} b 减数
	 * @return {Number}   差
	 */
	function minus(a, b) {
	  return sum(a, -b);
	}
	/**
	 * 除法运算，解决了js运算的精度问题
	 * @param  {Number} a 被除数
	 * @param  {Number} b 除数
	 * @return {Number}   结果
	 */
	function divide(a, b) {
	  var ca = getDecimalDigitCount(a);
	  var cb = getDecimalDigitCount(b);
	  var intA = parseInt(('' + a).replace('.', ''), 10);
	  var intB = parseInt(('' + b).replace('.', ''), 10);

	  return intA / intB * Math.pow(10, cb - ca);
	}

	function modulo(a, b) {
	  var mod = Math.abs(b);

	  if (b <= 0) {
	    return a;
	  }

	  var cnt = Math.floor(a / mod);

	  return minus(a, multiply(mod, cnt));
	}

	/**
	 * 按照固定的步长获取[start, end)这个区间的数据
	 * 并且需要处理js计算精度的问题
	 *
	 * @param  {Number} start 起点
	 * @param  {Number} end   终点，不包含该值
	 * @param  {Number} step  步长
	 * @return {Array}        若干数值
	 */
	function rangeStep(start, end, step) {
	  var num = start;
	  var result = [];

	  while (num < end) {
	    result.push(num);

	    num = sum(num, step);
	  }

	  return result;
	}
	/**
	 * 对数值进行线性插值
	 *
	 * @param  {Number} a  定义域的极点
	 * @param  {Number} b  定义域的极点
	 * @param  {Number} t  [0, 1]内的某个值
	 * @return {Number}    定义域内的某个值
	 */
	var interpolateNumber = (0, _utils.curry)(function (a, b, t) {
	  var newA = +a;
	  var newB = +b;

	  return newA + t * (newB - newA);
	});
	/**
	 * 线性插值的逆运算
	 *
	 * @param  {Number} a 定义域的极点
	 * @param  {Number} b 定义域的极点
	 * @param  {Number} x 可以认为是插值后的一个输出值
	 * @return {Number}   当x在 a ~ b这个范围内时，返回值属于[0, 1]
	 */
	var uninterpolateNumber = (0, _utils.curry)(function (a, b, x) {
	  var diff = b - +a;

	  diff = diff || Infinity;

	  return (x - a) / diff;
	});
	/**
	 * 线性插值的逆运算，并且有截断的操作
	 *
	 * @param  {Number} a 定义域的极点
	 * @param  {Number} b 定义域的极点
	 * @param  {Number} x 可以认为是插值后的一个输出值
	 * @return {Number}   当x在 a ~ b这个区间内时，返回值属于[0, 1]，
	 * 当x不在 a ~ b这个区间时，会截断到 a ~ b 这个区间
	 */
	var uninterpolateTruncation = (0, _utils.curry)(function (a, b, x) {
	  var diff = b - +a;

	  diff = diff || Infinity;

	  return Math.max(0, Math.min(1, (x - a) / diff));
	});

	exports.default = {
	  rangeStep: rangeStep,
	  isFloat: isFloat,
	  getDigitCount: getDigitCount,
	  getDecimalDigitCount: getDecimalDigitCount,

	  sum: sum,
	  minus: minus,
	  multiply: multiply,
	  divide: divide,
	  modulo: modulo,
	  strip: strip,

	  interpolateNumber: interpolateNumber,
	  uninterpolateNumber: uninterpolateNumber,
	  uninterpolateTruncation: uninterpolateTruncation
	};

/***/ }
/******/ ])
});
;