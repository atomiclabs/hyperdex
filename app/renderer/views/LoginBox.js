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
		} catch (err) {
			console.error(err);

			this.setState({passwordInputValue: ''});

			const passwordError = /Authentication failed/.test(err.message) ? t('incorrectPassword') : err.message;
			await this.setState({
				isLoggingIn: false,
				passwordError,
			});
			this.passwordInputRef.current.focus();
		}
	};

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
							onChange={this.handleSelectChange}
							onClose={this.handleSelectClose}
							valueRenderer={this.selectOptionRenderer}
							optionRenderer={this.selectOptionRenderer}
							placeholder={t('selectPortfolio')}
							disabled={this.state.isLoggingIn}
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
							onChange={this.handlePasswordInputChange}
							type="password"
							placeholder={t('password')}
							value={this.state.passwordInputValue}
							disabled={!selectedPortfolioId || this.state.isLoggingIn}
							autoFocus
							required
							errorMessage={this.state.passwordError}
						/>
					</div>
					<div className="form-group form-group-2">
						<Button primary fullwidth type="submit" value={t('login')} disabled={!this.state.passwordInputValue || this.state.isLoggingIn}/>
						<Link
							disabled={this.state.isLoggingIn}
							onClick={() => {
								loginContainer.setActiveView('ForgotPasswordStep1');
								loginContainer.setProgress(0.33);
							}}
							style={{
								fontSize: '13px',
								lineHeight: 1.5,
								marginTop: '13px',
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
