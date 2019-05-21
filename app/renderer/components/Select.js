import React from 'react';
import PropTypes from 'prop-types';
import ReactSelect from 'react-select';
import './Select.scss';

const Select = ({searchable, clearable, forwardedRef, ...props}) => {
	return <ReactSelect {...props} ref={forwardedRef} searchable={searchable} clearable={clearable}/>;
};

Select.propTypes = {
	...ReactSelect.propTypes,
	forwardedRef: PropTypes.oneOfType([
		PropTypes.elementType,
		PropTypes.object,
	]),
};

Select.defaultProps = {
	// Rule disabled because of https://github.com/yannickcr/eslint-plugin-react/issues/1674
	/* eslint-disable react/default-props-match-prop-types */
	clearable: false,
	searchable: false,
	/* eslint-enable react/default-props-match-prop-types */
	forwardedRef: undefined,
};

export default React.forwardRef((props, ref) => (
	<Select {...props} forwardedRef={ref}/>
));
