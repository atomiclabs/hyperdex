import React from 'react';
import PropTypes from 'prop-types';
import './Empty.scss';

const Empty = ({show, text}) => {
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
	show: PropTypes.bool,
	text: PropTypes.string,
};

export default Empty;
