import React from 'react';
import Image from './Image';

const CurrencyIcon = ({symbol, ...props}) => (
	<Image
		{...props}
		url={`/assets/cryptocurrency-icons/${symbol.toLowerCase()}.svg`}
		fallbackUrl="/assets/cryptocurrency-icons/generic.svg"
	/>
);

export default CurrencyIcon;
