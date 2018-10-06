import React from 'react';
import PropTypes from 'prop-types';
import {classNames} from 'react-extras';
import './TabButton.scss';

const TabButton = ({onClick, children, active, className, ...props}) => (
	<span
		{...props}
		role="button"
		onClick={event => {
			if (typeof onClick === 'function') {
				onClick(event);
			}
		}}
		className={
			classNames('TabButton', {active}, className)
		}
	>
		{children}
	</span>
);

TabButton.propTypes = {
	className: PropTypes.string,
	active: PropTypes.bool,
	children: PropTypes.node,
	onClick: PropTypes.func,
};

export default TabButton;
