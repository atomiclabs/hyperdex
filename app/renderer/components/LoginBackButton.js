import React from 'react';
import PropTypes from 'prop-types';
import loginContainer from 'containers/Login';
import BackButton from './BackButton';
import './LoginBackButton.scss';

const LoginBackButton = props => (
	<BackButton className={`${props.className} LoginBackButton`} onClick={() => {
		loginContainer.setActiveView(props.view);
		loginContainer.setProgress(props.progress);
	}}/>
);

LoginBackButton.propTypes = {
	className: PropTypes.string,
	view: PropTypes.string.isRequired,
	progress: PropTypes.number.isRequired,
};

LoginBackButton.defaultProps = {
	className: '',
};

export default LoginBackButton;
