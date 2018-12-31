import React from 'react';
import PropTypes from 'prop-types';
import BackArrowIcon from 'icons/BackArrow';
import './BackButton.scss';

const BackButton = ({className, ...props}) => (
	<button {...props} type="button" className={`${className} BackButton`}>
		<BackArrowIcon/>
	</button>
);

BackButton.propTypes = {
	className: PropTypes.string,
};

BackButton.defaultProps = {
	className: '',
};

export default BackButton;
