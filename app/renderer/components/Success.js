import React from 'react';
import PropTypes from 'prop-types';
import './Success.scss';

const Success = ({className, children, ...props}) => (
	<div {...props} className={`${className} Success`}>
		<img src="/assets/success-icon.svg" width="60" height="60"/>
		<h1>{children}</h1>
	</div>
);

Success.propTypes = {
	children: PropTypes.node,
	className: PropTypes.string,
};

export default Success;
