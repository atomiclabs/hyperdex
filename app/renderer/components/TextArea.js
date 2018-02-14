import React from 'react';
import {RSTextarea} from 'reactsymbols-kit';
import {classNames} from 'react-extras';
import './TextArea.scss';

const TextArea = ({preventNewlines, onChange, ...props}) => {
	const className = classNames('TextArea', props.className);

	return (
		<RSTextarea {...props} className={className} onChange={value => {
			if (preventNewlines && /\r?\n/.test(value)) {
				return;
			}

			if (onChange) {
				onChange(value);
			}
		}}/>
	);
};

export default TextArea;
