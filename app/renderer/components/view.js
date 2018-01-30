import React from 'react';
import {If} from 'react-extras';

const View = ({isActive, component: Component, ...rest}) => (
	<If condition={isActive} render={() => (
		<Component {...rest}/>
	)}/>
);

export default View;
