export const formatCurrency = number => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
	}).format(number).replace(/\.00/, '');
};
