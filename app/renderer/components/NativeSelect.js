import React from 'react';
import './NativeSelect.scss';

const NativeSelect = props => {
	return (
		<div className="NativeSelect">
			<select {...props}/>
		</div>
	);
};

export default NativeSelect;
