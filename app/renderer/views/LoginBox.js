import React from 'react';
import Button from '../components/Button';
import Input from '../components/Input';
import Select from '../components/Select';
import SelectOption from '../components/SelectOption';
import Link from '../components/Link';
import CreatePortfolioButton from './CreatePortfolioButton';
import './LoginBox.scss';

class LoginBox extends React.Component {
	state = {
		passwordInputValue: '',
		isCheckingPassword: false,
	};

	handleSelectChange = selectedOption => {
		this.setState({passwordError: null});
		this.props.setSelectedPortfolioId(selectedOption.value);
	};

	handleSelectClose = () => {
		// TODO: Make this more React'y. Focusing inputs with React is a pain...
		document.querySelector('input[type="password"]').focus();
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

	portfolioFromId = id => this.props.portfolios.find(portfolio => portfolio.id === id);

	handleSubmit = async event => {
		event.preventDefault();

		this.setState({
			isCheckingPassword: true,
			passwordError: null,
		});

		const {selectedPortfolioId, handleLogin} = this.props;
		const portfolio = this.portfolioFromId(selectedPortfolioId);
		const {passwordInputValue} = this.state;

		try {
			await handleLogin(portfolio, passwordInputValue);
		} catch (err) {
			console.error(err);

			this.setState({passwordInputValue: ''});

			const passwordError = /Authentication failed/.test(err.message) ? 'Incorrect password' : err.message;
			this.setState({
				isCheckingPassword: false,
				passwordError,
			});
		}
	};

	render() {
		const {portfolios, selectedPortfolioId} = this.props;

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
						<CreatePortfolioButton {...this.props}/>
					</div>
					<div className="form-group">
						<Input
							onChange={this.handlePasswordInputChange}
							type="password"
							placeholder="Password"
							value={this.state.passwordInputValue}
							disabled={!selectedPortfolioId || this.state.isCheckingPassword}
							autoFocus
							text={this.state.passwordError && this.state.passwordError}
							level={this.state.passwordError && 'danger'}
							required
						/>
					</div>
					<div className="form-group form-group-2">
						<Button primary fullwidth type="submit" value="Login" disabled={!this.state.passwordInputValue || this.state.isCheckingPassword}/>
						<Link
							onClick={() => {
								this.props.setLoginView('ForgotPassword');
								this.props.setLoginProgress(0.33);
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
