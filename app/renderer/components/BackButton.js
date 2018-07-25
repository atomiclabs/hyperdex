import React from 'react';
import BackArrowIcon from 'icons/BackArrow';
import './BackButton.scss';

const BackButton = ({className, ...props}) => (
	<button {...props} type="button" className={`${className} BackButton`}>
		<BackArrowIcon/>
	</button>
);

export default BackButton;
