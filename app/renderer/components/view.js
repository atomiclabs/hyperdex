import React from 'react';

const View = ({isActive, component: Component, ...rest}) => isActive ? <Component {...rest}/> : null;

export default View;
