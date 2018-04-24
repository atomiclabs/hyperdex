import React from 'react';
import {classNames} from 'react-extras';
import './Progress.scss';

const Progress = ({value, showLabel, hideWhenZero, ...props}) => {
	if (value > 1 || value < 0) {
		throw new TypeError('Expected a value in the range 0...1');
	}

	const className = classNames('Progress', props.className);
	const percentage = Math.round(value * 100);
	const percentageFormatted = `${percentage}%`;

	if (hideWhenZero && percentage === 0) {
		return null;
	}

	return (
		<div {...props} className={className}>
			<div className="Progress__bar" style={{width: percentageFormatted}}>
				{showLabel &&
					<div className="Progress__label">{percentageFormatted}</div>
				}
			</div>
		</div>
	);
};

export default Progress;
