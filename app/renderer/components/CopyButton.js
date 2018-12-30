import {clipboard} from 'electron';
import React from 'react';
import PropTypes from 'prop-types';
import CopyIcon from 'icons/Copy';
import './CopyButton.scss';

const CopyButton = ({value, className, onClick, ...props}) => {
	return (
		<button
			{...props}
			type="button"
			className={`${className} CopyButton`}
			onClick={event => {
				onClick(event);
				clipboard.writeText(value);
			}}
		>
			<CopyIcon size="17px"/>
		</button>
	);
};

CopyButton.propTypes = {
	value: PropTypes.string.isRequired,
	className: PropTypes.string,
	onClick: PropTypes.func,
};

CopyButton.defaultProps = {
	className: '',
	onClick: () => {},
};

export default CopyButton;
