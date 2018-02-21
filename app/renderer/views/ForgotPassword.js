import {remote} from 'electron';
import React from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import LoginBackButton from '../components/LoginBackButton';
import Success from '../components/Success';
import View from '../components/View';
import './ForgotPassword.scss';

const {changePortfolioPassword} = remote.require('./portfolio-util');

const ForgotPasswordStep1 = props => {
	return (
		<div className="ForgotPassword">
			<LoginBackButton {...props} view="LoginBox" progress={0}/>
			<h1>Enter Your Seed Phrase</h1>
			<p>TODO: Put some explanation here on what to do.</p>
			<div className="form-group" style={{width: '460px'}}>
				<TextArea
					value={props.seedPhrase}
					onChange={props.handleSeedPhraseInputChange}
					placeholder="Example: advanced generous profound …"
					autoFocus
					required
					preventNewlines
					level={props.seedPhraseError && 'danger'}
					text={props.seedPhraseError}
					style={{padding: '15px'}}
				/>
			</div>
			<div className="form-group">
				<Button
					primary
					value="Confirm"
					disabled={!props.seedPhrase}
					onClick={props.handleClickConfirmSeedPhrase}
					style={{width: '172px', marginTop: '18px'}}
				/>
			</div>
		</div>
	);
};

const ForgotPasswordStep2 = props => {
	const portfolio = props.portfolios.find(portfolio => portfolio.id === props.selectedPortfolioId);

	// TODO(sindresorhus): Add the identicon to the portfolio field

	return (
		<div className="ForgotPassword">
			<LoginBackButton {...props} view="ForgotPasswordStep1" progress={0.33}/>
			<h1>Set New Password</h1>
			<form onSubmit={props.handleSubmit} style={{marginTop: '20px'}}>
				<div className="form-group">
					<Input
						className="portfolio-name"
						value={portfolio.name}
						disabled
					/>
				</div>
				<div className="form-group">
					<Input
						onChange={props.handlePasswordInputChange}
						type="password"
						placeholder="Password"
						value={props.password}
						autoFocus
						required
					/>
				</div>
				<div className="form-group">
					<Input
						innerRef={props.setConfirmPasswordInput}
						onChange={props.handleConfirmPasswordInputChange}
						type="password"
						placeholder="Confirm Password"
						value={props.confirmedPassword}
						required
						errorMessage={props.confirmedPasswordError}
					/>
				</div>
				<div className="form-group">
					<Button
						primary
						type="submit"
						value="Confirm"
						disabled={!(props.password && props.confirmedPassword)}
						style={{width: '170px', marginTop: '15px'}}
					/>
				</div>
			</form>
		</div>
	);
};

const ForgotPasswordStep3 = () => <Success>Your new password is set!</Success>;

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
		this.props.setLoginView('ForgotPasswordStep2');
		this.props.setLoginProgress(0.66);
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
			id: this.props.selectedPortfolioId,
			seedPhrase: this.state.seedPhrase,
			newPassword: this.state.password,
		});

		this.props.setLoginView('ForgotPasswordStep3');
		this.props.setLoginProgress(1);

		await this.props.loadPortfolios();
		await this.props.handleLogin(this.props.selectedPortfolioId, this.state.password);

		// TODO: Need a progress indicator here as login takes a while
	};

	componentWillMount() {
		this.props.setLoginView('ForgotPasswordStep1');
	}

	render() {
		const activeView = this.props.activeLoginView;

		return (
			<React.Fragment>
				<View
					{...this.props}
					{...this.state}
					activeView={activeView}
					component={ForgotPasswordStep1}
					handleSeedPhraseInputChange={this.handleSeedPhraseInputChange}
					handleClickConfirmSeedPhrase={this.handleClickConfirmSeedPhrase}
				/>
				<View
					{...this.props}
					{...this.state}
					activeView={activeView}
					component={ForgotPasswordStep2}
					setConfirmPasswordInput={this.setConfirmPasswordInput}
					handlePasswordInputChange={this.handlePasswordInputChange}
					handleConfirmPasswordInputChange={this.handleConfirmPasswordInputChange}
					handleSubmit={this.handleSubmit}
				/>
				<View activeView={activeView} component={ForgotPasswordStep3}/>
			</React.Fragment>
		);
	}
}

export default ForgotPassword;
