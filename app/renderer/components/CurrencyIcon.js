import React from 'react';
import PropTypes from 'prop-types';
import {Image} from 'react-extras';

// TODO: Read this list from disk instead. Not a priority though.
const hasCustomIcon = new Set([
	'BOTS',
	'CRYPTO',
	'DEX',
	'JUMBLR',
	'KV',
	'MSHARK',
	'MYTH',
	'PANGEA',
	'REVS',
	'SUPERNET',
	'WLC',
]);

const CurrencyIcon = ({symbol, size, ...props}) => {
	let url = `/assets/cryptocurrency-icons/${symbol.toLowerCase()}.svg`;

	if (hasCustomIcon.has(symbol)) {
		url = `/assets/custom-cryptocurrency-icons/${symbol.toLowerCase()}.svg`;
	}

	return (
		<Image
			{...props}
			url={url}
			fallbackUrl="/assets/cryptocurrency-icons/generic.svg"
			width={size}
			height={size}
		/>
	);
};

CurrencyIcon.propTypes = {
	symbol: PropTypes.string.isRequired,
	size: PropTypes.string,
};

CurrencyIcon.defaultProps = {
	size: undefined,
};

export default CurrencyIcon;
