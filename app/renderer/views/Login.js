import {remote} from 'electron';
import {centerWindow} from 'electron-util';
import React from 'react';
import {Subscribe} from 'unstated';
import Progress from 'components/Progress';
import LoginView from 'components/LoginView';
import loginContainer from 'containers/Login';
import {loginWindowSize} from '../../constants';
import NewPortfolio from './NewPortfolio';
import LoginBox from './LoginBox';
import CreatePortfolio from './CreatePortfolio';
import RestorePortfolio from './RestorePortfolio';
import ForgotPassword from './ForgotPassword';
import LoggingIn from './LoggingIn';
import './Login.scss';

const setLoginWindowBounds = () => {
	const win = remote.getCurrentWindow();
	win.setFullScreen(false);
	win.setFullScreenable(false);
	win.setResizable(false);
	win.setMaximizable(false);
	win.setMinimumSize(loginWindowSize.width, loginWindowSize.height);
	centerWindow({
		size: {
			width: loginWindowSize.width,
			height: loginWindowSize.height,
		},
	});
};

class Login extends React.Component {
	componentWillMount() {
		setLoginWindowBounds();
	}

	render() {
		return (
			<Subscribe to={[loginContainer]}>
				{login => {
					if (login.state.portfolios === null) {
						return null; // Not loaded yet
					}

					const LoginViews = () => (
						<React.Fragment>
							<LoginView component={NewPortfolio}/>
							<LoginView component={LoginBox}/>
							<LoginView component={LoggingIn}/>
							<CreatePortfolio/>
							<RestorePortfolio/>
							<ForgotPassword/>
						</React.Fragment>
					);

					return (
						<div className="Login container">
							<div className="window-draggable-area"/>
							<Progress className="login-progress" value={login.state.progress}/>
							<div className="is-centered">
								<img className="hyperdex-icon" src="/assets/hyperdex-icon.svg" width="75" height="75"/>
								<LoginViews/>
							</div>
						</div>
					);
				}}
			</Subscribe>
		);
	}
}

export default Login;
