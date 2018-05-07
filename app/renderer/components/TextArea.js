import React from 'react';
import {classNames} from 'react-extras';
import './TextArea.scss';

const TextArea = ({
	className,
	level,
	message,
	errorMessage,
	disabled,
	onChange,
	preventNewlines,
	...props
}, ref) => {
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
					ref={ref}
					disabled={disabled}
					onChange={event => {
						const {target} = event;
						const {value} = target;

						if (preventNewlines && /\r?\n/.test(value)) {
							const form = target.closest('form');
							if (form) {
								form.dispatchEvent(new Event('submit'));
							}

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

export default React.forwardRef(TextArea);
