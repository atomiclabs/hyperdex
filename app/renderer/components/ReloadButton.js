import React from 'react';
import PropTypes from 'prop-types';
import ReloadIcon from 'icons/Reload';
import './CopyButton.scss';

const ReloadButton = ({className, ...props}) => (
	<button {...props} type="button" className={`${className} ReloadButton`}>
		<ReloadIcon size="15px"/>
	</button>
);

ReloadButton.propTypes = {
	className: PropTypes.string,
};

export default ReloadButton;
