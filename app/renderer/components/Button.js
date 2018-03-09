import React from 'react';
import {classNames} from 'react-extras';
import './Button.scss';

const Button = ({primary, fullwidth, green, red, ...props}) => {
	const className = classNames('Button', {
		'Button--primary': primary,
		'Button--green': green,
		'Button--red': red,
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

export default Button;
