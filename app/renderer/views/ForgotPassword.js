import {remote} from 'electron';
import React from 'react';
import View from '../components/View';
import {loginContainer} from '../containers/Login';
import ForgotPasswordStep1 from './ForgotPasswordStep1';
import ForgotPasswordStep2 from './ForgotPasswordStep2';
import ForgotPasswordStep3 from './ForgotPasswordStep3';
import './ForgotPassword.scss';

const {changePortfolioPassword} = remote.require('./portfolio-util');

class ForgotPassword extends React.Component {
	state = {
		seedPhrase: '',
		password: '',
		confirmedPassword: '',
		confirmedPasswordError: null,
		seedPhraseError: null,
	};

	handleSeedPhraseInputChange = value => {
		const seedPhraseError = (value.length > 0 && value.length < 10) ? 'The seed phrase you entered is not very secure.' : null;
		this.setState({
			seedPhrase: value,
			seedPhraseError,
		});
	};

	handleClickConfirmSeedPhrase = () => {
		loginContainer.setActiveView('ForgotPasswordStep2');
		loginContainer.setProgress(0.66);
	};

	handlePasswordInputChange = value => {
		this.setState({password: value});
	};

	handleConfirmPasswordInputChange = value => {
		this.setState({confirmedPassword: value});
	};

	setConfirmPasswordInput = input => {
		this.confirmPasswordInput = input;
	}

	handleSubmit = async event => {
		event.preventDefault();

		if (this.state.password !== this.state.confirmedPassword) {
			this.setState({
				confirmedPassword: '',
				confirmedPasswordError: 'Confirmed password doesn\'t match password',
			});
			this.confirmPasswordInput.focus();
			return;
		}

		this.setState({confirmedPasswordError: null});

		await changePortfolioPassword({
			id: loginContainer.state.selectedPortfolioId,
			seedPhrase: this.state.seedPhrase,
			newPassword: this.state.password,
		});

		loginContainer.setActiveView('ForgotPasswordStep3');
		loginContainer.setProgress(1);

		await loginContainer.loadPortfolios();
		await loginContainer.handleLogin(loginContainer.state.selectedPortfolioId, this.state.password);

		// TODO: Need a progress indicator here as login takes a while
	};

	componentWillMount() {
		loginContainer.setActiveView('ForgotPasswordStep1');
	}

	render() {
		const activeView = loginContainer.state.activeView;

		return (
			<React.Fragment>
				<View
					{...this.state}
					activeView={activeView}
					component={ForgotPasswordStep1}
					handleSeedPhraseInputChange={this.handleSeedPhraseInputChange}
					handleClickConfirmSeedPhrase={this.handleClickConfirmSeedPhrase}
				/>
				<View
					{...this.state}
					activeView={activeView}
					component={ForgotPasswordStep2}
					setConfirmPasswordInput={this.setConfirmPasswordInput}
					handlePasswordInputChange={this.handlePasswordInputChange}
					handleConfirmPasswordInputChange={this.handleConfirmPasswordInputChange}
					handleSubmit={this.handleSubmit}
				/>
				<View
					activeView={activeView}
					component={ForgotPasswordStep3}
				/>
			</React.Fragment>
		);
	}
}

export default ForgotPassword;
