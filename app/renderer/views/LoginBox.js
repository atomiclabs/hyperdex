import electron from 'electron';
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
		selectedOption: null,
		passwordInputValue: '',
		isCheckingPassword: false,
	};

	handleSelectChange = selectedOption => {
		this.setState({
			selectedOption,
			passwordError: null,
		});
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

	handleSubmit = async event => {
		event.preventDefault();

		this.setState({isCheckingPassword: true});

		const {portfolios, handleLogin} = this.props;
		const portfolio = portfolios.find(portfolio => portfolio.fileName === this.state.selectedOption.value);
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

	setLastActivePortfolio() {
		const lastActivePortfolio = electron.remote.require('./config').get('lastActivePortfolio');
		const portfolio = this.props.portfolios.find(portfolio => portfolio.fileName === lastActivePortfolio);

		if (portfolio) {
			this.setState({
				selectedOption: {
					label: portfolio.name,
					value: portfolio.fileName,
				},
			});
		}
	}

	componentWillMount() {
		this.setLastActivePortfolio();
	}

	render() {
		const {portfolios} = this.props;

		const selectData = portfolios.map(portfolio => {
			return {
				label: portfolio.name,
				value: portfolio.fileName,
			};
		});

		return (
			<div className="LoginBox" style={{width: '245px'}}>
				<form onSubmit={this.handleSubmit}>
					<div className="form-group form-group-1">
						<Select
							className="portfolio-selector"
							value={this.state.selectedOption && this.state.selectedOption.value}
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
							disabled={!this.state.selectedOption || this.state.isCheckingPassword}
							autoFocus
							text={this.state.passwordError && this.state.passwordError}
							level={this.state.passwordError && 'danger'}
							style={{width: '100%'}}
							required
						/>
					</div>
					<div className="form-group" style={{marginTop: '25px'}}>
						<Button primary fullwidth type="submit" value="Login" disabled={!this.state.passwordInputValue || this.state.isCheckingPassword}/>
						<Link style={{fontSize: '13px', lineHeight: 1.5, marginTop: '13px'}}>Forgot password</Link>
					</div>
				</form>
			</div>
		);
	}
}

export default LoginBox;
