import {remote} from 'electron';
import bip39 from 'bip39';
import {Container} from 'unstated';
import {translate} from '../translate';
import loginContainer from './Login';

const {createPortfolio} = remote.require('./portfolio-util');
const t = translate('portfolio');

class CreatePortfolioContainer extends Container {
	state = {
		portfolioName: '',
		portfolioPassword: '',
		confirmedPassword: '',
		confirmedPasswordError: null,
		generatedSeedPhrase: '',
		confirmedSeedPhrase: '',
		seedPhraseError: null,
		isCreatingPortfolio: false,
	};

	constructor() {
		super();
		this.generateSeedPhrase();
	}

	generateSeedPhrase = () => {
		this.setState({generatedSeedPhrase: bip39.generateMnemonic()});
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

	handleStep1Submit = async event => {
		event.preventDefault();

		if (this.state.portfolioPassword !== this.state.confirmedPassword) {
			this.setState({
				confirmedPassword: '',
				confirmedPasswordError: t('create.confirmPasswordNoMatch'),
			});
			this.confirmPasswordInput.focus();
			return;
		}

		this.setState({confirmedPasswordError: null});

		loginContainer.setActiveView('CreatePortfolioStep2');
		loginContainer.setProgress(0.50);
	};

	handleStep2ClickNext = () => {
		loginContainer.setActiveView('CreatePortfolioStep3');
		loginContainer.setProgress(0.75);
	};

	checkSeedPhrase = () => {
		const isMatch = this.state.generatedSeedPhrase === this.state.confirmedSeedPhrase;
		const seedPhraseError = isMatch ? null : t('create.seedPhraseNoMatch');
		this.setState({seedPhraseError});
		return isMatch;
	};

	handleConfirmSeedPhraseInputChange = async value => {
		await this.setState({confirmedSeedPhrase: value});

		if (this.step3confirmButtonClicked) {
			this.checkSeedPhrase();
		}
	};

	handleStep3Submit = async event => {
		event.preventDefault();

		this.step3confirmButtonClicked = true;

		if (!this.checkSeedPhrase()) {
			this.confirmSeedPhraseTextArea.focus();
			return;
		}

		await this.setState({isCreatingPortfolio: true});

		const portfolioId = await createPortfolio({
			name: this.state.portfolioName,
			password: this.state.portfolioPassword,
			seedPhrase: this.state.generatedSeedPhrase,
		});

		loginContainer.setActiveView('CreatePortfolioStep4');
		loginContainer.setProgress(1);

		await loginContainer.loadPortfolios();
		await loginContainer.handleLogin(portfolioId, this.state.portfolioPassword);
	};
}

const createPortfolioContainer = new CreatePortfolioContainer();

export default createPortfolioContainer;
