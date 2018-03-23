import React from 'react';
import loginContainer from 'containers/Login';
import BackButton from './BackButton';
import './LoginBackButton.scss';

const LoginBackButton = props => (
	<BackButton className={`${props.className} LoginBackButton`} onClick={() => {
		loginContainer.setActiveView(props.view);
		loginContainer.setProgress(props.progress);
	}}/>
);

export default LoginBackButton;
