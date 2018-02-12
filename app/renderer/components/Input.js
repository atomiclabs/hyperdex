import React from 'react';
import {RSInput} from 'reactsymbols-kit';
import {classNames} from 'react-extras';
import './Input.scss';

// See: http://docs.reactsymbols.com/#/?id=rsinput

const Input = props => {
	const className = classNames('Input', props.className);
	return <RSInput {...props} iconSize={16} className={className}/>;
};

export default Input;
