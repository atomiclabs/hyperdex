import React from 'react';
import Image from './Image';

// TODO: Read this list from disk instead. Not a priority though.
const hasCustomIcon = new Set([
	'BEER',
	'BOTS',
	'CRYPTO',
	'DEX',
	'JUMBLR',
	'KV',
	'MSHARK',
	'PANGEA',
	'PIZZA',
	'REVS',
	'SUPERNET',
	'WLC',
	'MYTH',
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

export default CurrencyIcon;
