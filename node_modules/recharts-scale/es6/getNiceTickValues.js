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

var _utils = require('./util/utils');

var _arithmetic = require('./util/arithmetic');

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