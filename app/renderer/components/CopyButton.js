import React from 'react';
import './CopyButton.scss';

const {clipboard} = global.mainModules.electron;

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
