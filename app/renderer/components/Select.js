import React from 'react';
import ReactSelect from 'react-select';
import './Select.scss';

const Select = ({
	searchable = false,
	clearable = false,
	...props
}) => {
	return <ReactSelect {...props} searchable={searchable} clearable={clearable}/>;
};

export default Select;
