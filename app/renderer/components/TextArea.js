import React from 'react';
import {RSTextarea} from 'reactsymbols-kit';
import {classNames} from 'react-extras';
import './TextArea.scss';

const TextArea = props => {
	const className = classNames('TextArea', props.className);
	return <RSTextarea {...props} className={className}/>;
};

export default TextArea;
