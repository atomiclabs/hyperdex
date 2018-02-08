import React from 'react';
import {classNames} from 'react-extras';
import './Button.scss';

const Button = ({primary, fullwidth, ...props}) => {
	const className = classNames('Button', {
		'Button--primary': primary,
		'Button--fullwidth': fullwidth,
		'Button--disabled': props.disabled,
	});

	return (
		<button {...props} type="button" className={className}>
			<div className="Button__helper"/>
			<span className="Button__value">
				{props.value}
			</span>
		</button>
	);
};

export default Button;
