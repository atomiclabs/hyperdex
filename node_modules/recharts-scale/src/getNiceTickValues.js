/**
 * @fileOverview calculate tick values of scale
 * @author xile611, arcthur
 * @date 2015-09-17
 */

import { compose, range, memoize, map, reverse } from './util/utils';
import Arithmetic from './util/arithmetic';

/**
 * Calculate a interval of a minimum value and a maximum value
 *
 * @param  {Number} min       The minimum value
 * @param  {Number} max       The maximum value
 * @return {Array} An interval
 */
function getValidInterval([min, max]) {
  let [validMin, validMax] = [min, max];

  // exchange
  if (min > max) {
    [validMin, validMax] = [max, min];
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
  if (roughStep <= 0) { return 0; }

  const digitCount = Arithmetic.getDigitCount(roughStep);
  // The ratio between the rough step and the smallest number which has a bigger
  // order of magnitudes than the rough step
  const stepRatio = roughStep / Math.pow(10, digitCount);
  // When an integer and a float multiplied, the accuracy of result may be wrong
  const amendStepRatio = digitCount !== 1 ?
    Arithmetic.multiply(Math.ceil(stepRatio / 0.05) + correctionFactor, 0.05) :
    Arithmetic.multiply(Math.ceil(stepRatio / 0.1) + correctionFactor, 0.1);

  const formatStep = Arithmetic.multiply(amendStepRatio, Math.pow(10, digitCount));

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
  const isFlt = Arithmetic.isFloat(value);
  let step = 1;
  // calculate the middle value of ticks
  let middle = value;

  if (isFlt && allowDecimals) {
    const absVal = Math.abs(value);

    if (absVal < 1) {
      // The step should be a float number when the difference is smaller than 1
      step = Math.pow(10, Arithmetic.getDigitCount(value) - 1);

      middle = Arithmetic.multiply(Math.floor(value / step), step);
    } else if (absVal > 1) {
      // Return the maximum integer which is smaller than 'value' when 'value' is greater than 1
      middle = Math.floor(value);
    }
  } else if (value === 0) {
    middle = Math.floor((tickCount - 1) / 2);
  } else if (!allowDecimals) {
    middle = Math.floor(value);
  }

  const middleIndex = Math.floor((tickCount - 1) / 2);

  const fn = compose(
    map(n => Arithmetic.sum(middle, Arithmetic.multiply(n - middleIndex, step))),
    range
  );

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
function calculateStep(min, max, tickCount, allowDecimals, correctionFactor = 0) {
  // The step which is easy to understand between two ticks
  const step = getFormatStep((max - min) / (tickCount - 1), allowDecimals, correctionFactor);

  // A medial value of ticks
  let middle;

  // When 0 is inside the interval, 0 should be a tick
  if (min <= 0 && max >= 0) {
    middle = 0;
  } else {
    // calculate the middle value
    middle = Arithmetic.divide(Arithmetic.sum(min, max), 2);
    // minus modulo value
    middle = Arithmetic.minus(middle, Arithmetic.modulo(middle, step));
    // strip
    middle = Arithmetic.strip(middle, 16);
  }

  let belowCount = Math.ceil((middle - min) / step);
  let upCount = Math.ceil((max - middle) / step);
  const scaleCount = belowCount + upCount + 1;

  if (scaleCount > tickCount) {
    // When more ticks need to cover the interval, step should be bigger.
    return calculateStep(min, max, tickCount, allowDecimals, correctionFactor + 1);
  } else if (scaleCount < tickCount) {
    // When less ticks can cover the interval, we should add some additional ticks
    upCount = max > 0 ? upCount + (tickCount - scaleCount) : upCount;
    belowCount = max > 0 ? belowCount : belowCount + (tickCount - scaleCount);
  }

  return {
    step,
    tickMin: Arithmetic.minus(middle, Arithmetic.multiply(belowCount, step)),
    tickMax: Arithmetic.sum(middle, Arithmetic.multiply(upCount, step)),
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
function getNiceTickValuesFn([min, max], tickCount = 6, allowDecimals = true) {
  // More than two ticks should be return
  const count = Math.max(tickCount, 2);
  const [cormin, cormax] = getValidInterval([min, max]);

  if (cormin === cormax) {
    return getTickOfSingleValue(cormin, tickCount, allowDecimals);
  }

  // Get the step between two ticks
  const { step, tickMin, tickMax } = calculateStep(cormin, cormax, count, allowDecimals);

  const values = Arithmetic.rangeStep(tickMin, tickMax + 0.1 * step, step);

  return min > max ? reverse(values) : values;
}

function getTickValuesFn([min, max], tickCount = 6, allowDecimals = true) {
  // More than two ticks should be return
  const count = Math.max(tickCount, 2);
  const [cormin, cormax] = getValidInterval([min, max]);

  if (cormin === cormax) {
    return getTickOfSingleValue(cormin, tickCount, allowDecimals);
  }

  const step = getFormatStep((cormax - cormin) / (count - 1), allowDecimals, 0);

  const fn = compose(
    map(n => (cormin + n * step)),
    range
  );

  const values = fn(0, count).filter(entry => (entry >= cormin && entry <= cormax));

  return min > max ? reverse(values) : values;
}

function getTickValuesFixedDomainFn([min, max], tickCount, allowDecimals = true) {
  // More than two ticks should be return
  const [cormin, cormax] = getValidInterval([min, max]);

  if (cormin === cormax) { return [cormin]; }

  const count = Math.max(tickCount, 2);
  const step = getFormatStep((cormax - cormin) / (count - 1), allowDecimals, 0);
  const values = [...Arithmetic.rangeStep(cormin, cormax - 0.99 * step, step), cormax];

  return min > max ? reverse(values) : values;
}

export const getNiceTickValues = memoize(getNiceTickValuesFn);
export const getTickValues = memoize(getTickValuesFn);
export const getTickValuesFixedDomain = memoize(getTickValuesFixedDomainFn);

