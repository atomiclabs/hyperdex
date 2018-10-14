import React from 'react';
import PropTypes from 'prop-types';
import {classNames} from 'react-extras';
import './TabButton.scss';

const TabButton = ({onClick, children, isActive, className, ...props}) => (
	<span
		{...props}
		role="button"
		onClick={onClick}
		className={
			classNames('TabButton', {active: isActive}, className)
		}
	>
		{children}
	</span>
);

TabButton.propTypes = {
	className: PropTypes.string,
	isActive: PropTypes.bool,
	children: PropTypes.node,
	onClick: PropTypes.func,
};

export default TabButton;
