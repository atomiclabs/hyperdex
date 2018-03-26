import React from 'react';
import SelectOption from './SelectOption';

const CurrencySelectOption = option => (
	<SelectOption
		image={`/assets/cryptocurrency-icons/${option.value.toLowerCase()}.svg`}
		fallbackImage="/assets/cryptocurrency-icons/generic.svg"
		label={option.label}
	/>
);

export default CurrencySelectOption;
