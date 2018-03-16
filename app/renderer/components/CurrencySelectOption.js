import React from 'react';
import SelectOption from './SelectOption';

const CurrencySelectOption = option => (
	<SelectOption
		image={`/assets/cryptocurrency-icons/${option.value.toLowerCase()}.svg`}
		label={option.label}
	/>
);

export default CurrencySelectOption;
