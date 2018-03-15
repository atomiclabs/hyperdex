import React from 'react';
import View from 'components/View';
import {loginContainer} from 'containers/Login';

const LoginView = ({component}) => (
	<View component={component} activeView={loginContainer.state.activeView}/>
);

export default LoginView;
