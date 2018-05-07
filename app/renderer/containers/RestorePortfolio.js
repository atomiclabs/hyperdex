import {remote} from 'electron';
import {Container} from 'unstated';
import loginContainer from './Login';

const {createPortfolio} = remote.require('./portfolio-util');

class RestorePortfolioContainer extends Container {
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

		if (!this.state.seedPhrase) {
			return;
		}

		loginContainer.setActiveView('RestorePortfolioStep2');
		loginContainer.setProgress(0.66);
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

		loginContainer.setActiveView('RestorePortfolioStep3');
		loginContainer.setProgress(1);

		await loginContainer.loadPortfolios();
		await loginContainer.handleLogin(portfolioId, this.state.portfolioPassword);
	};
}

const restorePortfolioContainer = new RestorePortfolioContainer();

export default restorePortfolioContainer;
