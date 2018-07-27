import React from 'react';
import PropTypes from 'prop-types';
import {classNames} from 'react-extras';
import './Button.scss';

const Button = ({primary, fullwidth, color, ...props}) => {
	const className = classNames('Button', {
		'Button--primary': primary,
		[`Button--${color}`]: color,
		'Button--fullwidth': fullwidth,
		'Button--disabled': props.disabled,
	}, props.className);

	return (
		<button type="button" {...props} className={className}>
			<div className="Button__helper"/>
			<span className="Button__value">
				{props.value}
			</span>
		</button>
	);
};

Button.propTypes = {
	color: PropTypes.string,
	fullwidth: PropTypes.bool,
	primary: PropTypes.bool,
};

export default Button;
