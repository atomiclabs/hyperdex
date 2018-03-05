import {remote} from 'electron';
import React from 'react';
import {Subscribe} from 'unstated';
import Progress from '../components/Progress';
import View from '../components/View';
import LoginContainer from '../containers/Login';
import CreatePortfolioContainer from '../containers/CreatePortfolio';
import RestorePortfolioContainer from '../containers/RestorePortfolio';
import ForgotPasswordContainer from '../containers/ForgotPassword';
import NewPortfolio from './NewPortfolio';
import LoginBox from './LoginBox';
import CreatePortfolioStep1 from './CreatePortfolioStep1';
import CreatePortfolioStep2 from './CreatePortfolioStep2';
import CreatePortfolioStep3 from './CreatePortfolioStep3';
import CreatePortfolioStep4 from './CreatePortfolioStep4';
import RestorePortfolioStep1 from './RestorePortfolioStep1';
import RestorePortfolioStep2 from './RestorePortfolioStep2';
import RestorePortfolioStep3 from './RestorePortfolioStep3';
import ForgotPasswordStep1 from './ForgotPasswordStep1';
import ForgotPasswordStep2 from './ForgotPasswordStep2';
import ForgotPasswordStep3 from './ForgotPasswordStep3';
import './Login.scss';

class Login extends React.Component {
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

					const LoginView = ({component}) => (
						<View component={component} activeView={login.state.activeView}/>
					);

					const CreatePortfolio = () => (
						<Subscribe to={[CreatePortfolioContainer]}>
							{() => (
								<React.Fragment>
									<LoginView component={CreatePortfolioStep1}/>
									<LoginView component={CreatePortfolioStep2}/>
									<LoginView component={CreatePortfolioStep3}/>
									<LoginView component={CreatePortfolioStep4}/>
								</React.Fragment>
							)}
						</Subscribe>
					);

					const RestorePortfolio = () => (
						<Subscribe to={[RestorePortfolioContainer]}>
							{() => (
								<React.Fragment>
									<LoginView component={RestorePortfolioStep1}/>
									<LoginView component={RestorePortfolioStep2}/>
									<LoginView component={RestorePortfolioStep3}/>
								</React.Fragment>
							)}
						</Subscribe>
					);

					const ForgotPassword = () => (
						<Subscribe to={[ForgotPasswordContainer]}>
							{() => (
								<React.Fragment>
									<LoginView component={ForgotPasswordStep1}/>
									<LoginView component={ForgotPasswordStep2}/>
									<LoginView component={ForgotPasswordStep3}/>
								</React.Fragment>
							)}
						</Subscribe>
					);

					const LoginViews = () => (
						<React.Fragment>
							<LoginView component={NewPortfolio}/>
							<LoginView component={LoginBox}/>
							<CreatePortfolio/>
							<RestorePortfolio/>
							<ForgotPassword/>
						</React.Fragment>
					);

					return (
						<div className="Login container">
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
