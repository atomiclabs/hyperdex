import {clipboard} from 'electron';
import React from 'react';
import './CopyButton.scss';

const CopyButton = ({className, value, ...props}) => {
	return (
		<button
			{...props}
			type="button"
			className={`${className} CopyButton`}
			onClick={() => {
				clipboard.writeText(value);
			}}
		/>
	);
};

export default CopyButton;
