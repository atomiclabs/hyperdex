export const formatCurrency = number => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(number).replace(/\.00/, '');
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
