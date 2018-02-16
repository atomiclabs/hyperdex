import {remote} from 'electron';
import React from 'react';
import bip39 from 'bip39';
import Button from '../components/Button';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import LoginBackButton from '../components/LoginBackButton';
import Success from '../components/Success';
import ReloadButton from '../components/ReloadButton';
import CopyButton from '../components/CopyButton';
import View from '../components/View';
import WrapWidth from '../components/WrapWidth';
import './CreatePortfolio.scss';

const {createPortfolio} = remote.require('./portfolio-util');

const CreatePortfolioStep1 = props => {
	// TODO(sindresorhus): Add icon to the input fields
	// TODO(sindresorhus): Should we have some minimum requirements for the password?

	return (
		<div className="CreatePortfolio">
			<LoginBackButton {...props} view="LoginBox" progress={0}/>
			<h1>Create New Portfolio</h1>
			<form onSubmit={props.handleStep1Submit} style={{marginTop: '20px'}}>
				<div className="form-group">
					<Input
						onChange={props.handlePortfolioNameInputChange}
						placeholder="Portfolio Name"
						value={props.portfolioName}
						autoFocus
						required
						maxLength="50"
					/>
				</div>
				<div className="form-group">
					<Input
						onChange={props.handlePortfolioPasswordInputChange}
						type="password"
						placeholder="Password"
						value={props.portfolioPassword}
						required
					/>
				</div>
				<div className="form-group">
					<Button
						type="submit"
						value="Next"
						disabled={!(props.portfolioName && props.portfolioPassword)}
						style={{width: '170px', marginTop: '18px'}}
					/>
				</div>
			</form>
		</div>
	);
};

const CreatePortfolioStep2 = props => {
	// TODO(sindresorhus): Fill in the link to security best practices

	return (
		<div className="CreatePortfolio">
			<LoginBackButton {...props} view="CreatePortfolioStep1" progress={0.25}/>
			<h1>Seed Phrase for Your Portfolio</h1>
			<div className="form-group" style={{width: '460px', marginTop: '20px'}}>
				<div className="generated-seed-phrase-container">
					<ReloadButton onClick={props.generateSeedPhrase}/>
					<WrapWidth wordsPerLine={6} className="seed-phrase">
						{props.generatedSeedPhrase}
					</WrapWidth>
					<CopyButton value={props.generatedSeedPhrase}/>
				</div>
				<div className="warning-box">
					<img className="icon" src="/assets/warning-icon.svg" width="30" height="30"/>
					<div className="content">
						<h3>Important: please back up your seed phrase now!</h3>
						<p>We recommend storing it offline. <a href="#">Learn more security best practices</a></p>
					</div>
				</div>
			</div>
			<div className="form-group">
				<Button
					value="Next"
					onClick={props.handleStep2ClickNext}
					style={{width: '172px', marginTop: '7px'}}
				/>
			</div>
		</div>
	);
};

const CreatePortfolioStep3 = props => {
	return (
		<div className="CreatePortfolio">
			<LoginBackButton {...props} view="CreatePortfolioStep2" progress={0.50}/>
			<h1>Confirm Your Seed Phrase</h1>
			<p>TODO: Put some explanation here on what to do.</p>
			<div className="form-group" style={{width: '460px'}}>
				<TextArea
					value={props.confirmedSeedPhrase}
					onChange={props.handleConfirmSeedPhraseInputChange}
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
					disabled={!props.confirmedSeedPhrase || props.seedPhraseError}
					onClick={props.handleStep3ClickConfirm}
					style={{
						width: '172px',
						marginTop: '18px',
					}}
				/>
			</div>
		</div>
	);
};

const CreatePortfolioStep4 = () => <Success>New portfolio added!</Success>;

class CreatePortfolio extends React.Component {
	state = {
		portfolioName: '',
		portfolioPassword: '',
		generatedSeedPhrase: '',
		confirmedSeedPhrase: '',
		seedPhraseError: null,
	};

	generateSeedPhrase = () => {
		this.setState({generatedSeedPhrase: bip39.generateMnemonic()});
	};

	handlePortfolioNameInputChange = value => {
		this.setState({portfolioName: value});
	};

	handlePortfolioPasswordInputChange = value => {
		this.setState({portfolioPassword: value});
	};

	handleStep1Submit = async event => {
		event.preventDefault();

		this.props.setLoginView('CreatePortfolioStep2');
		this.props.setLoginProgress(0.50);
	};

	handleStep2ClickNext = () => {
		this.props.setLoginView('CreatePortfolioStep3');
		this.props.setLoginProgress(0.75);
	};

	handleConfirmSeedPhraseInputChange = value => {
		this.setState({
			confirmedSeedPhrase: value,
			seedPhraseError: null,
		});
	};

	handleStep3ClickConfirm = async () => {
		if (this.state.generatedSeedPhrase !== this.state.confirmedSeedPhrase) {
			this.setState({
				seedPhraseError: 'The seed phrase you entered is not the same as the generated one',
			});
			return;
		}

		// TODO: Validate that the generated seedphrase matches the user typed seedphrase

		const portfolioId = await createPortfolio({
			name: this.state.portfolioName,
			password: this.state.portfolioPassword,
			seedPhrase: this.state.generatedSeedPhrase,
		});

		this.props.setLoginView('CreatePortfolioStep4');
		this.props.setLoginProgress(1);

		await this.props.loadPortfolios();
		await this.props.handleLogin(portfolioId, this.state.portfolioPassword);

		// TODO: Need a progress indicator here as login takes a while
	};

	componentWillMount() {
		this.generateSeedPhrase();
		this.props.setLoginView('CreatePortfolioStep1');
	}

	render() {
		const activeView = this.props.activeLoginView;

		return (
			<React.Fragment>
				<View
					{...this.props}
					{...this.state}
					activeView={activeView}
					component={CreatePortfolioStep1}
					handlePortfolioNameInputChange={this.handlePortfolioNameInputChange}
					handlePortfolioPasswordInputChange={this.handlePortfolioPasswordInputChange}
					handleStep1Submit={this.handleStep1Submit}
				/>
				<View
					{...this.props}
					{...this.state}
					activeView={activeView}
					component={CreatePortfolioStep2}
					generateSeedPhrase={this.generateSeedPhrase}
					handleStep2ClickNext={this.handleStep2ClickNext}
				/>
				<View
					{...this.props}
					{...this.state}
					activeView={activeView}
					component={CreatePortfolioStep3}
					handleConfirmSeedPhraseInputChange={this.handleConfirmSeedPhraseInputChange}
					handleStep3ClickConfirm={this.handleStep3ClickConfirm}
				/>
				<View
					activeView={activeView}
					component={CreatePortfolioStep4}
				/>
			</React.Fragment>
		);
	}
}

export default CreatePortfolio;
