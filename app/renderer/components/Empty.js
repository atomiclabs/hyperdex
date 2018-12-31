import React from 'react';
import PropTypes from 'prop-types';
import './Empty.scss';

const Empty = ({text, show}) => {
	if (!show) {
		return null;
	}

	return (
		<div className="Empty">
			<p>{text}</p>
		</div>
	);
};

Empty.propTypes = {
	text: PropTypes.string.isRequired,
	show: PropTypes.bool,
};

Empty.defaultProps = {
	show: false,
};

export default Empty;
