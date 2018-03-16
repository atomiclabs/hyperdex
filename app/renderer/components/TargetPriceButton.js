import React from 'react';

const TargetPriceButton = props => (
	<div onClick={props.onClick}>
		<img src="/assets/crosshair-icon.svg"/>
	</div>
);

export default TargetPriceButton;
