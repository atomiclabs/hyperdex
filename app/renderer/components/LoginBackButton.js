import React from 'react';
import BackButton from './BackButton';
import './LoginBackButton.scss';

const LoginBackButton = props => (
	<BackButton className={`${props.className} LoginBackButton`} onClick={() => {
		props.setLoginState({
			activeView: props.view,
			progress: props.progress,
		});
	}}/>
);

export default LoginBackButton;
