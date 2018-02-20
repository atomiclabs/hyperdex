import React from 'react';
import {classNames} from 'react-extras';
import './Input.scss';

const Input = ({
	className,
	level,
	message,
	errorMessage,
	disabled,
	innerRef,
	onChange,
	type = 'text',
	iconName,
	...props
}) => {
	if (errorMessage) {
		level = 'error';
		message = errorMessage;
	}

	if (type === 'password') {
		iconName = 'password';
	}

	const containerClassName = classNames(
		'Input',
		{
			[`Input--${level}`]: level,
			'Input--disabled': disabled,
			'Input--icon': iconName,
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
					onChange={event => {
						if (onChange) {
							onChange(event.target.value);
						}
					}}
				/>
				{iconName &&
					<span className="Input__icon">
						<img src={`/assets/${iconName}-icon.svg`}/>
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
