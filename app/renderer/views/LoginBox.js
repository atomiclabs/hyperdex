import React from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import SelectOption from '../components/SelectOption';
import Link from '../components/Link';
import PlusButton from '../components/PlusButton';
import {sharedLoginContainer} from '../LoginContainer';
import './LoginBox.scss';

class LoginBox extends React.Component {
	state = {
		passwordInputValue: '',
		isCheckingPassword: false,
	};

	handleSelectChange = selectedOption => {
		this.setState({passwordError: null});
		sharedLoginContainer.setSelectedPortfolioId(selectedOption.value);
	};

	handleSelectClose = () => {
		this.passwordInput.focus();
	};

	selectOptionRenderer = option => {
		return (
			<SelectOption
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
			isCheckingPassword: true,
			passwordError: null,
		});

		const {selectedPortfolioId} = sharedLoginContainer.state;
		const {passwordInputValue} = this.state;

		try {
			await sharedLoginContainer.handleLogin(selectedPortfolioId, passwordInputValue);
		} catch (err) {
			console.error(err);

			this.setState({passwordInputValue: ''});

			const passwordError = /Authentication failed/.test(err.message) ? 'Incorrect password' : err.message;
			this.setState({
				isCheckingPassword: false,
				passwordError,
			}, () => {
				this.passwordInput.focus();
			});
		}
	};

	render() {
		const {portfolios, selectedPortfolioId} = sharedLoginContainer.state;

		if (portfolios.length === 0) {
			sharedLoginContainer.setActiveView('NewPortfolio');
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
				<h1>Welcome to HyperDEX!</h1>
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
							placeholder="Select Portfolio…"
						/>
						<PlusButton
							onClick={() => {
								sharedLoginContainer.setActiveView('NewPortfolio');
							}}
						/>
					</div>
					<div className="form-group">
						<Input
							innerRef={input => {
								this.passwordInput = input;
							}}
							onChange={this.handlePasswordInputChange}
							type="password"
							placeholder="Password"
							value={this.state.passwordInputValue}
							disabled={!selectedPortfolioId || this.state.isCheckingPassword}
							autoFocus
							required
							errorMessage={this.state.passwordError}
						/>
					</div>
					<div className="form-group form-group-2">
						<Button primary fullwidth type="submit" value="Login" disabled={!this.state.passwordInputValue || this.state.isCheckingPassword}/>
						<Link
							onClick={() => {
								sharedLoginContainer.setActiveView('ForgotPassword');
								sharedLoginContainer.setProgress(0.33);
							}}
							style={{
								fontSize: '13px',
								lineHeight: 1.5,
								marginTop: '13px',
							}}
						>
							Forgot password
						</Link>
					</div>
				</form>
			</div>
		);
	}
}

export default LoginBox;
