import React from 'react';
import PropTypes from 'prop-types';
import CurrencyIcon from './CurrencyIcon';
import SelectOption from './SelectOption';

const CurrencySelectOption = option => (
	<SelectOption
		{...option}
		imageRenderer={() => <CurrencyIcon symbol={option.value} size="20"/>}
	/>
);

CurrencySelectOption.propTypes = {
	option: PropTypes.shape({
		label: PropTypes.string,
		value: PropTypes.string,
	}),
};

export default CurrencySelectOption;
