export const formatCurrency = number => {
	const options = {
		style: 'currency',
		currency: 'USD',
	};

	if (number < 1 && number > 0) {
		options.minimumFractionDigits = 4;
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
