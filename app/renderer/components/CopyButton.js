import {clipboard} from 'electron';
import React from 'react';
import CopyIcon from 'icons/Copy';
import './CopyButton.scss';

const CopyButton = ({className, onClick, value, ...props}) => {
	return (
		<button
			{...props}
			type="button"
			className={`${className} CopyButton`}
			onClick={event => {
				if (typeof onClick === 'function') {
					onClick(event);
				}

				clipboard.writeText(value);
			}}
		>
			<CopyIcon size="17px"/>
		</button>
	);
};

export default CopyButton;
