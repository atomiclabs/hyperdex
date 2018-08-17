import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import './Select.scss';

const Select = ({searchable, clearable, forwardedRef, ...props}) => {
	return <ReactSelect {...props} ref={forwardedRef} searchable={searchable} clearable={clearable}/>;
};

Select.propTypes = {
	clearable: PropTypes.bool,
	searchable: PropTypes.bool,
};

Select.defaultProps = {
	clearable: false,
	searchable: false,
};

export default React.forwardRef((props, ref) => (
	<Select {...props} forwardedRef={ref}/>
));
