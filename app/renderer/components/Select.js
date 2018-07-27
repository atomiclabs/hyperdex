import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import './Select.scss';

const Select = ({searchable, clearable, ...props}) => {
	return <ReactSelect {...props} searchable={searchable} clearable={clearable}/>;
};

Select.propTypes = {
	clearable: PropTypes.bool,
	searchable: PropTypes.bool,
};

Select.defaultProps = {
	clearable: false,
	searchable: false,
};

export default Select;
