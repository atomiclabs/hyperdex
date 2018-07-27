import {clipboard} from 'electron';
import React from 'react';
import PropTypes from 'prop-types';
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

CopyButton.propTypes = {
	className: PropTypes.string,
	onClick: PropTypes.func,
	value: PropTypes.string,
};

export default CopyButton;
