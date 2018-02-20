import React from 'react';
import {classNames} from 'react-extras';
import './TextArea.scss';

const TextArea = ({
	className,
	level,
	message,
	errorMessage,
	disabled,
	innerRef,
	onChange,
	preventNewlines,
	...props
}) => {
	if (errorMessage) {
		level = 'error';
		message = errorMessage;
	}

	const containerClassName = classNames(
		'TextArea',
		'Input',
		{
			[`Input--${level}`]: level,
			'Input--disabled': disabled,
		},
		className
	);

	return (
		<div className={containerClassName}>
			<div className="Input-wrap">
				<textarea
					{...props}
					ref={innerRef}
					disabled={disabled}
					onChange={event => {
						const value = event.target.value;

						if (preventNewlines && /\r?\n/.test(value)) {
							return;
						}

						if (onChange) {
							onChange(value);
						}
					}}
				/>
			</div>
			{((level && message) || message) &&
				<span className="Input__text">
					<p>{message}</p>
				</span>
			}
		</div>
	);
};

export default TextArea;
