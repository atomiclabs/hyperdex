import {remote} from 'electron';
import React from 'react';
import {Subscribe} from 'unstated';
import Progress from '../components/Progress';
import LoginContainer, {loginContainer} from '../containers/Login';
import NewPortfolio from './NewPortfolio';
import LoginBox from './LoginBox';
import RestorePortfolio from './RestorePortfolio';
import CreatePortfolio from './CreatePortfolio';
import ForgotPassword from './ForgotPassword';
import './Login.scss';

class Login extends React.Component {
	renderSubview() {
		const view = loginContainer.state.activeView;

		if (view === 'NewPortfolio') {
			return <NewPortfolio/>;
		}

		if (view === 'LoginBox') {
			return <LoginBox/>;
		}

		if (view.startsWith('RestorePortfolio')) {
			return <RestorePortfolio/>;
		}

		if (view.startsWith('CreatePortfolio')) {
			return <CreatePortfolio/>;
		}

		if (view.startsWith('ForgotPassword')) {
			return <ForgotPassword/>;
		}
	}

	componentWillMount() {
		// Enforce window size
		const win = remote.getCurrentWindow();
		win.setResizable(false);
		win.setSize(660, 450, true);
	}

	render() {
		return (
			<Subscribe to={[LoginContainer]}>
				{login => {
					if (login.state.portfolios === null) {
						return null; // Not loaded yet
					}

					return (
						<div className="Login container">
							<Progress className="login-progress" value={login.state.progress}/>
							<div className="is-centered">
								<img className="hyperdex-icon" src="/assets/hyperdex-icon.svg" width="75" height="75"/>
								{this.renderSubview()}
							</div>
						</div>
					);
				}}
			</Subscribe>
		);
	}
}

export default Login;
