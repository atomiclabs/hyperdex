import React from 'react';
import PropTypes from 'prop-types';
import propTypesRange from 'prop-types-range';
import {classNames} from 'react-extras';
import './Progress.scss';

const Progress = ({value, color, hideWhenZero, showLabel, ...props}) => {
	const className = classNames('Progress', props.className);
	const percentage = Math.round(value * 100);
	const percentageFormatted = `${percentage}%`;

	if (hideWhenZero && percentage === 0) {
		return null;
	}

	return (
		<div {...props} className={className}>
			<div className="Progress__bar" style={{width: percentageFormatted, background: color}}>
				{showLabel &&
					<div className="Progress__label">{percentageFormatted}</div>
				}
			</div>
		</div>
	);
};

Progress.propTypes = {
	value: propTypesRange(0, 1),
	className: PropTypes.string,
	color: PropTypes.string,
	hideWhenZero: PropTypes.bool,
	showLabel: PropTypes.bool,
};

Progress.defaultProps = {
	value: 0,
	className: '',
	color: '',
	hideWhenZero: false,
	showLabel: false,
};

export default Progress;
