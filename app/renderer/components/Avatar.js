import React from 'react';
import appContainer from 'containers/App';
import avatar from '../avatar';

const Avatar = props => (
	<img {...props} src={avatar(appContainer.state.portfolio.id)}/>
);

export default Avatar;
