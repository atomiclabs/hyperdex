import {remote} from 'electron';
import {Container} from 'unstated';
import {translate} from '../translate';
import loginContainer from './Login';

const {changePortfolioPassword} = remote.require('./portfolio-util');
const t = translate('forgot-password');

class ForgotPasswordContainer extends Container {
	state = {
		seedPhrase: '',
		password: '',
		confirmedPassword: '',
		confirmedPasswordError: null,
		seedPhraseError: null,
	};

	handleSeedPhraseInputChange = value => {
		const seedPhraseError = (value.length > 0 && value.length < 10) ? t('seedPhraseNotSecure') : null;
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

	handleSubmit = async event => {
		event.preventDefault();

		if (this.state.password !== this.state.confirmedPassword) {
			this.setState({
				confirmedPassword: '',
				confirmedPasswordError: t('confirmPasswordNoMatch'),
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
	};
}

const forgotPasswordContainer = new ForgotPasswordContainer();

export default forgotPasswordContainer;
