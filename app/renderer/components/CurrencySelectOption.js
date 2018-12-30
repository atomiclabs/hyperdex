import React from 'react';
import CurrencyIcon from './CurrencyIcon';
import SelectOption from './SelectOption';

const CurrencySelectOption = option => (
	<SelectOption
		{...option}
		imageRenderer={() => <CurrencyIcon symbol={option.value} size="20"/>}
	/>
);

CurrencySelectOption.propTypes = SelectOption.propTypes;

export default CurrencySelectOption;
