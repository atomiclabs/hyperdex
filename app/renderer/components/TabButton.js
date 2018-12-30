import React from 'react';
import PropTypes from 'prop-types';
import {classNames} from 'react-extras';
import './TabButton.scss';

const TabButton = ({children, className, isActive, onClick, ...props}) => (
	<span
		{...props}
		role="button"
		className={
			classNames('TabButton', {active: isActive}, className)
		}
		onClick={onClick}
	>
		{children}
	</span>
);

TabButton.propTypes = {
	children: PropTypes.node.isRequired,
	className: PropTypes.string,
	isActive: PropTypes.bool.isRequired,
	onClick: PropTypes.func.isRequired,
};

TabButton.defaultProps = {
	className: '',
};

export default TabButton;
