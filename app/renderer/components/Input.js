import React from 'react';
import {classNames} from 'react-extras';
import './Input.scss';

const Input = ({
	className,
	level,
	message,
	errorMessage,
	disabled,
	readOnly,
	innerRef,
	onChange,
	type = 'text',
	icon,
	iconSize,
	iconName,
	button: Button,
	...props
}) => {
	if (errorMessage) {
		level = 'error';
		message = errorMessage;
	}

	if (type === 'password') {
		iconName = 'password';
	}

	if (iconName) {
		icon = `/assets/${iconName}-icon.svg`;
	}

	const containerClassName = classNames(
		'Input',
		{
			[`Input--${level}`]: level,
			'Input--disabled': disabled,
			'Input--readonly': readOnly,
			'Input--icon': icon,
			'Input--button': Button,
		},
		className
	);

	return (
		<div className={containerClassName}>
			<div className="Input-wrap">
				<input
					{...props}
					ref={innerRef}
					type={type}
					disabled={disabled}
					readOnly={readOnly}
					onChange={event => {
						if (onChange) {
							onChange(event.target.value, event);
						}
					}}
				/>
				{icon &&
					<span className="Input__icon">
						<img src={icon} width={iconSize}/>
					</span>
				}
				{Button &&
					<span className="Input__button">
						<Button/>
					</span>
				}
			</div>
			{((level && message) || message) &&
				<span className="Input__text">
					<p>{message}</p>
				</span>
			}
		</div>
	);
};

export default Input;
