import React from 'react';
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

export default Empty;
