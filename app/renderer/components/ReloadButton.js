import React from 'react';
import ReloadIcon from 'icons/Reload';
import './CopyButton.scss';

const ReloadButton = ({className, ...props}) => (
	<button {...props} type="button" className={`${className} ReloadButton`}>
		<ReloadIcon size="15px"/>
	</button>
);

export default ReloadButton;
