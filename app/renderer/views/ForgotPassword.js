import {remote} from 'electron';
import React from 'react';
import delay from 'delay';
import Button from '../components/Button';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import LoginBackButton from '../components/LoginBackButton';
import Success from '../components/Success';
import './ForgotPassword.scss';

const {changePortfolioPassword} = remote.require('./portfolio-util');

class ForgotPassword extends React.Component {
	state = {
		seedPhraseInputValue: '',
		passwordInputValue: '',
	};

	handleSeedPhraseInputChange = value => {
		// Prevent newlines
		if (/\r?\n/.test(value)) {
			if (this.state.seedPhraseInputValue.trim().length > 0) {
				this.handleClickConfirmSeedPhrase();
			}

			return;
		}

		this.setState({seedPhraseInputValue: value});
	};

	handleClickConfirmSeedPhrase = () => {
		this.props.setLoginState({
			activeView: 'ForgotPassword2',
			progress: 0.66,
		});
	};

	handlePasswordInputChange = value => {
		this.setState({passwordInputValue: value});
	};

	handleSubmit = async event => {
		event.preventDefault();

		await changePortfolioPassword({
			id: this.props.loginState.selectedPortfolioId,
			seedPhrase: this.state.seedPhraseInputValue,
			newPassword: this.state.passwordInputValue,
		});

		this.props.setLoginState({
			activeView: 'ForgotPassword3',
			progress: 1,
		});

		await this.props.loadPortfolios();
		await delay(2000);

		this.props.setLoginState({
			activeView: 'LoginBox',
			progress: 0,
		});
	};

	renderSeedPhraseView() {
		return (
			<div className="ForgotPassword">
				<LoginBackButton {...this.props} view="LoginBox" progress={0}/>
				<h1>Enter Your Seed Phrase</h1>
				<p>TODO: Put some explanation here on what to do.</p>
				<div className="form-group" style={{width: '460px'}}>
					<TextArea
						value={this.state.seedPhraseInputValue}
						onChange={this.handleSeedPhraseInputChange}
						placeholder="Example: advanced generous profound …"
						autoFocus
						required
					/>
				</div>
				<div className="form-group">
					<Button
						primary
						value="Confirm"
						disabled={!this.state.seedPhraseInputValue}
						onClick={this.handleClickConfirmSeedPhrase}
						style={{width: '172px', marginTop: '18px'}}
					/>
				</div>
			</div>
		);
	}

	renderSetPasswordView() {
		const portfolio = this.props.portfolios.find(portfolio => portfolio.id === this.props.loginState.selectedPortfolioId);

		// TODO(sindresorhus): Add the identicon to the portfolio field
		// TODO(sindresorhus): Add the lock icon to the input

		return (
			<div className="ForgotPassword">
				<LoginBackButton {...this.props} view="ForgotPassword" progress={0.33}/>
				<h1>Set New Password</h1>
				<form onSubmit={this.handleSubmit} style={{marginTop: '20px'}}>
					<div className="form-group">
						<Input
							className="portfolio-name"
							value={portfolio.name}
							disabled
						/>
					</div>
					<div className="form-group">
						<Input
							onChange={this.handlePasswordInputChange}
							type="password"
							placeholder="Password"
							value={this.state.passwordInputValue}
							autoFocus
							required
						/>
					</div>
					<div className="form-group">
						<Button
							primary
							type="submit"
							value="Confirm"
							disabled={!this.state.passwordInputValue}
							style={{width: '170px', marginTop: '18px'}}
						/>
					</div>
				</form>
			</div>
		);
	}

	renderSuccessView() {
		return (
			<Success>
				Your new password is set!
			</Success>
		);
	}

	render() {
		switch (this.props.loginState.activeView) {
			case 'ForgotPassword':
				return this.renderSeedPhraseView();
			case 'ForgotPassword2':
				return this.renderSetPasswordView();
			case 'ForgotPassword3':
				return this.renderSuccessView();
			default:
				// ignore
		}
	}
}

export default ForgotPassword;
