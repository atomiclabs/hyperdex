import React from 'react';
import PlusIcon from 'icons/Plus';
import './PlusButton.scss';

const PlusButton = ({className, ...props}) => (
	<button {...props} type="button" className={`${className} PlusButton`}>
		<PlusIcon size="7px"/>
	</button>
);

export default PlusButton;
