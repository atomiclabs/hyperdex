import unhandled from 'electron-unhandled';
import React from 'react';
import Button from 'components/Button';
import Input from 'components/Input';
import Select from 'components/Select';
import SelectOption from 'components/SelectOption';
import Link from 'components/Link';
import PlusButton from 'components/PlusButton';
import CogIcon from 'icons/Cog';
import appContainer from 'containers/App';
import loginContainer from 'containers/Login';
import avatar from '../avatar';
import {translate} from '../translate';
import './LoginBox.scss';

const t = translate('login');

const SettingsButton = () => (
	<CogIcon
		className="SettingsButton"
		size="15px"
		onClick={() => {
			appContainer.setActiveView('AppSettings');
		}}
	/>
);

class LoginBox extends React.Component {
	state = {
		passwordInputValue: '',
		isLoggingIn: false,
	};

	passwordInputRef = React.createRef();

	handleSelectChange = selectedOption => {
		this.setState({passwordError: null});
		loginContainer.setSelectedPortfolioId(selectedOption.value);
	};

	handleSelectClose = () => {
		this.passwordInputRef.current.focus();
	};

	selectOptionRenderer = option => {
		return (
			<SelectOption
				image={avatar(option.value)}
				label={option.label}
			/>
		);
	};

	handlePasswordInputChange = value => {
		this.setState({passwordInputValue: value});
	};

	handleSubmit = async event => {
		event.preventDefault();

		this.setState({
			isLoggingIn: true,
			passwordError: null,
		});

		const {selectedPortfolioId} = loginContainer.state;
		const {passwordInputValue} = this.state;

		try {
			await loginContainer.handleLogin(selectedPortfolioId, passwordInputValue);
		} catch (error) {
			if (this._isMounted) {
				await this.setState({
					isLoggingIn: false,
					passwordInputValue: '',
					passwordError: error.message,
				});

				this.passwordInputRef.current.focus();
				return;
			}

			loginContainer.setActiveView(LoginBox.name);
			unhandled.logError(error, {title: 'Login Failed'});
		}
	};

	componentDidMount() {
		this._isMounted = true;
	}

	componentWillUnmount() {
		this._isMounted = false;
	}

	render() {
		const {portfolios, selectedPortfolioId} = loginContainer.state;

		if (portfolios.length === 0) {
			loginContainer.setActiveView('NewPortfolio');
			return null;
		}

		const selectData = portfolios.map(portfolio => {
			return {
				label: portfolio.name,
				value: portfolio.id,
			};
		});

		return (
			<div className="LoginBox">
				<SettingsButton/>
				<form onSubmit={this.handleSubmit}>
					<div className="form-group form-group-1">
						<Select
							className="portfolio-selector"
							value={selectedPortfolioId}
							options={selectData}
							valueRenderer={this.selectOptionRenderer}
							optionRenderer={this.selectOptionRenderer}
							placeholder={t('selectPortfolio')}
							disabled={this.state.isLoggingIn}
							onChange={this.handleSelectChange}
							onClose={this.handleSelectClose}
						/>
						<PlusButton
							disabled={this.state.isLoggingIn}
							onClick={() => {
								loginContainer.setActiveView('NewPortfolio');
							}}
						/>
					</div>
					<div className="form-group">
						<Input
							ref={this.passwordInputRef}
							required
							autoFocus
							type="password"
							placeholder={t('password')}
							value={this.state.passwordInputValue}
							disabled={!selectedPortfolioId || this.state.isLoggingIn}
							errorMessage={this.state.passwordError}
							onChange={this.handlePasswordInputChange}
						/>
					</div>
					<div className="form-group form-group-2">
						<Button primary fullwidth type="submit" value={t('login')} disabled={!this.state.passwordInputValue || this.state.isLoggingIn}/>
						<Link
							disabled={this.state.isLoggingIn}
							style={{
								fontSize: '13px',
								lineHeight: 1.5,
								marginTop: '13px',
							}}
							onClick={() => {
								loginContainer.setActiveView('ForgotPasswordStep1');
								loginContainer.setProgress(0.33);
							}}
						>
							{t('forgotPassword')}
						</Link>
					</div>
				</form>
			</div>
		);
	}
}

export default LoginBox;
