import React from 'react';
import PropTypes from 'prop-types';
import PlusIcon from 'icons/Plus';
import './PlusButton.scss';

const PlusButton = ({className, ...props}) => (
	<button {...props} type="button" className={`${className} PlusButton`}>
		<PlusIcon size="7px"/>
	</button>
);

PlusButton.propTypes = {
	className: PropTypes.string,
};

PlusButton.defaultProps = {
	className: '',
};

export default PlusButton;
