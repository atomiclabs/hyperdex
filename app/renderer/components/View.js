import React from 'react';

const View = ({component: Component, ...rest}) => (
	Component.name === rest.activeView ? <Component {...rest}/> : null
);

export default View;
