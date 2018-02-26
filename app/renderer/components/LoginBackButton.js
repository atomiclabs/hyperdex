import React from 'react';
import {sharedLoginContainer} from '../LoginContainer';
import BackButton from './BackButton';
import './LoginBackButton.scss';

const LoginBackButton = props => (
	<BackButton className={`${props.className} LoginBackButton`} onClick={() => {
		sharedLoginContainer.setActiveView(props.view);
		sharedLoginContainer.setProgress(props.progress);
	}}/>
);

export default LoginBackButton;
