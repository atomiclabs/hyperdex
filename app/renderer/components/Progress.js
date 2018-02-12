import React from 'react';
import {classNames} from 'react-extras';
import './Progress.scss';

const Progress = ({value, ...props}) => {
	if (value > 1 || value < 0) {
		throw new TypeError('Expected a value in the range 0...1');
	}

	const className = classNames('Progress', props.className);

	return (
		<div {...props} className={className}>
			<div className="Progress__bar" style={{width: `${value * 100}%`}}/>
		</div>
	);
};

export default Progress;
