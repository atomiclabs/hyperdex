import React from 'react';
import PropTypes from 'prop-types';
import View from 'components/View';
import loginContainer from 'containers/Login';

const LoginView = ({component}) => (
	<View component={component} activeView={loginContainer.state.activeView}/>
);

LoginView.propTypes = {
	component: PropTypes.func,
};

export default LoginView;
