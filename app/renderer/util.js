import {remote} from 'electron';
import {centerWindow} from 'electron-util';
import {loginWindowSize} from '../constants';

export const formatCurrency = number => {
	const options = {
		style: 'currency',
		currency: 'USD',
	};

	if (number < 1 && number > 0) {
		options.minimumFractionDigits = 6;
	}

	let result = new Intl.NumberFormat('en-US', options).format(number);

	// Remove fractional trailing zeros
	result = result.replace(/(\d+(\.\d+[1-9])?)(\.?0+$)/, '$1');

	return result;
};

// Pads the fraction of a number with zeros and returns a string
// Example: `0.01` => `0.01000000`
export const zeroPadFraction = number => {
	const [integer, fraction] = number.toString().split('.');

	if (!fraction) {
		return number.toString();
	}

	return `${integer}.${fraction.padEnd(8, '0')}`;
};

export const setLoginWindowBounds = () => {
	const win = remote.getCurrentWindow();
	win.setFullScreen(false);
	win.setFullScreenable(false);
	win.setResizable(false);
	win.setMaximizable(false);
	win.setMinimumSize(loginWindowSize.width, loginWindowSize.height);
	centerWindow({
		size: {
			width: loginWindowSize.width,
			height: loginWindowSize.height,
		},
	});
};

export const setInputValue = (element, value) => {
	const {set: valueSetter} = Object.getOwnPropertyDescriptor(element, 'value') || {};
	const prototype = Object.getPrototypeOf(element);
	const {set: prototypeValueSetter} = Object.getOwnPropertyDescriptor(prototype, 'value') || {};

	if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
		prototypeValueSetter.call(element, value);
	} else if (valueSetter) {
		valueSetter.call(element, value);
	} else {
		throw new Error('The given element does not have a value setter');
	}

	element.dispatchEvent(new Event('input', {bubbles: true}));
};

export const config = remote.require('./config');
