import React from 'react';
import BackButton from './BackButton';
import './LoginBackButton.scss';

const LoginBackButton = props => (
	<BackButton className={`${props.className} LoginBackButton`} onClick={() => {
		props.setLoginView(props.view);
		props.setLoginProgress(props.progress);
	}}/>
);

export default LoginBackButton;
