import {remote} from 'electron';
import React from 'react';
import View from '../components/View';
import {sharedLoginContainer} from '../containers/Login';
import RestorePortfolioStep1 from './RestorePortfolioStep1';
import RestorePortfolioStep2 from './RestorePortfolioStep2';
import RestorePortfolioStep3 from './RestorePortfolioStep3';

const {createPortfolio} = remote.require('./portfolio-util');

class RestorePortfolio extends React.Component {
	state = {
		seedPhrase: '',
		portfolioName: '',
		portfolioPassword: '',
		confirmedPassword: '',
		confirmedPasswordError: null,
	};

	handleSeedPhraseInputChange = value => {
		this.setState({seedPhrase: value});
	};

	handleStep1Submit = async event => {
		event.preventDefault();

		sharedLoginContainer.setActiveView('RestorePortfolioStep2');
		sharedLoginContainer.setProgress(0.66);
	};

	setConfirmPasswordInput = input => {
		this.confirmPasswordInput = input;
	};

	handlePortfolioNameInputChange = value => {
		this.setState({portfolioName: value});
	};

	handlePortfolioPasswordInputChange = value => {
		this.setState({portfolioPassword: value});
	};

	handleConfirmPasswordInputChange = value => {
		this.setState({confirmedPassword: value});
	};

	handleStep2Submit = async event => {
		event.preventDefault();

		if (this.state.portfolioPassword !== this.state.confirmedPassword) {
			this.setState({
				confirmedPassword: '',
				confirmedPasswordError: 'Confirmed password doesn\'t match password',
			});
			this.confirmPasswordInput.focus();
			return;
		}

		this.setState({confirmedPasswordError: null});

		const portfolioId = await createPortfolio({
			name: this.state.portfolioName,
			password: this.state.portfolioPassword,
			seedPhrase: this.state.seedPhrase,
		});

		sharedLoginContainer.setActiveView('RestorePortfolioStep3');
		sharedLoginContainer.setProgress(1);

		await sharedLoginContainer.loadPortfolios();
		await sharedLoginContainer.handleLogin(portfolioId, this.state.portfolioPassword);
	};

	componentWillMount() {
		sharedLoginContainer.setActiveView('RestorePortfolioStep1');
	}

	render() {
		const activeView = sharedLoginContainer.state.activeView;

		return (
			<React.Fragment>
				<View
					{...this.state}
					activeView={activeView}
					component={RestorePortfolioStep1}
					handleSeedPhraseInputChange={this.handleSeedPhraseInputChange}
					handleStep1Submit={this.handleStep1Submit}
				/>
				<View
					{...this.state}
					activeView={activeView}
					component={RestorePortfolioStep2}
					setConfirmPasswordInput={this.setConfirmPasswordInput}
					handlePortfolioNameInputChange={this.handlePortfolioNameInputChange}
					handlePortfolioPasswordInputChange={this.handlePortfolioPasswordInputChange}
					handleConfirmPasswordInputChange={this.handleConfirmPasswordInputChange}
					handleStep2Submit={this.handleStep2Submit}
				/>
				<View
					activeView={activeView}
					component={RestorePortfolioStep3}
				/>
			</React.Fragment>
		);
	}
}

export default RestorePortfolio;
