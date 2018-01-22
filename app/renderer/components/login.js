import electron from 'electron';
import React from 'react';
import Blockies from 'react-blockies';
import {If, autoBind} from 'react-extras';
import Api from '../api';

/* eslint-disable */

const initMarketmaker = seedPhrase => new Promise(resolve => {
	electron.ipcRenderer.send('start-marketmaker', {seedPhrase});

	electron.ipcRenderer.on('marketmaker-started', async (event, port) => {
		resolve(`http://127.0.0.1:${port}`);
	});
});

const initApi = async seedPhrase => {
	const config = electron.remote.require('./config');

	let url = config.get('marketmakerUrl');
	if (url) {
		console.log('Using custom marketmaker URL:', url);
	} else {
		url = await initMarketmaker(seedPhrase);
	}

	return new Api({
		endpoint: url,
		seedPhrase,
	});
};

const portfolio = electron.remote.require('./portfolio');

const PortfolioImage = ({onClick, ...rest}) => (
	<div className="PortfolioImage" onClick={onClick}>
		<Blockies
			{...rest}
			size={10}
			scale={6}
			bgColor="transparent"
			color="rgba(255,255,255,0.15)"
			spotColor="rgba(255,255,255,0.25)"
		/>
	</div>
);

class CreatePortfolio extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);

		this.state = {showPortfolioForm: false};
	}

	showPortfolioForm() {
		this.setState({showPortfolioForm: true});
	}

	hidePortfolioForm() {
		this.setState({showPortfolioForm: false});
	}

	async onSubmit(event) {
		event.preventDefault();
		this.hidePortfolioForm();
		await portfolio.create(this.state);
		this.props.loadPortfolios();
	}

	render() {
		return (
			<div>
				<button className="add-portfolio btn btn-sm btn-primary btn-block" onClick={this.showPortfolioForm} disabled={this.state.showPortfolioForm}>Add portfolio</button>
				<If condition={this.state.showPortfolioForm} render={() => (
					<div className="add-portfolio-modal modal-dialog">
						<div className="modal-content">
							<form className="portfolio-form" onSubmit={this.onSubmit}>
								<div className="modal-header">
									<h5 className="modal-title">Add portfolio</h5>
									<button type="button" className="close" onClick={this.hidePortfolioForm}>
										<span>&times;</span>
									</button>
								</div>
								<div className="modal-body">
									<div className="form-group">
										<input
											type="text"
											className="form-control"
											placeholder="Portfolio Name"
											onChange={e => this.setState({ name: e.target.value })}
											autoFocus
										/>
									</div>
									<div className="form-group">
										<input
											type="text"
											className="form-control"
											placeholder="Seed Phrase"
											onChange={e => this.setState({ seedPhrase: e.target.value })}
										/>
									</div>
									<div className="form-group">
										<input
											type="password"
											className="form-control"
											placeholder="Password"
											onChange={e => this.setState({ password: e.target.value })}
										/>
									</div>
								</div>
								<div className="modal-footer">
									<button type="submit" className="btn btn-primary">Add</button>
									<button type="button" className="btn btn-secondary" onClick={this.hidePortfolioForm}>Close</button>
								</div>
							</form>
						</div>
					</div>
				)}/>
			</div>
		);
	}
}

class Portfolio extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);

		this.state = {
			isLoginInputVisible: this.props.showLoginForm,
			isCheckingPassword: false,
		};
	}

	showLoginInput() {
		this.setState({
			isLoginInputVisible: true,
		});
	}

	async onSubmit(event) {
		event.preventDefault();

		this.setState({isCheckingPassword: true});

		const {encryptedSeedPhrase} = this.props.portfolio;
		const password = this.input.value;

		try {
			// TODO: Show some loading here as it takes some time to decrypt the password and then start marketmaker
			const seedPhrase = await portfolio.decryptSeedPhrase(encryptedSeedPhrase, password);
			this.props.setPortfolio({
				...this.props.portfolio,
				api: await initApi(seedPhrase),
			});
		} catch (err) {
			console.error(err);

			this.input.value = '';

			const passwordError = /Authentication failed/.test(err.message) ? "Incorrect password" : err.message;
			this.setState({
				isCheckingPassword: false,
				passwordError,
			});
		}
	}

	render() {
		const {portfolio} = this.props;

		return (
			<div className="Portfolio">
				<PortfolioImage seed={portfolio.fileName} bgColor="transparent" onClick={this.showLoginInput} />
				<h4>{portfolio.name}</h4>
				<If condition={this.state.isLoginInputVisible} render={() => (
					<form className="login-form" onSubmit={this.onSubmit}>
						<div className="form-group">
							<input
								type="password"
								className="form-control"
								placeholder="Enter Your Password"
								ref={input => this.input = input}
								disabled={this.isCheckingPassword}
								autoFocus
							/>
						</div>
						<div className="form-group" disabled={this.isCheckingPassword}>
							<button type="submit" className="btn btn-primary btn-sm btn-block">Login</button>
						</div>
						<If condition={Boolean(this.state.passwordError)} render={() => (
							<div className="form-group">
								<div className="alert alert-danger" role="alert">
									{this.state.passwordError}
								</div>
							</div>
						)}/>
					</form>
				)}/>
			</div>
		);
	}
}

export default class Login extends React.Component {
	constructor(props) {
		super(props);
		autoBind(this);

		this.state = {
			portfolios: [],
		};

		this.loadPortfolios();
	}

	async loadPortfolios() {
		this.setState({
			portfolios: await portfolio.getAll(),
		});
	}

	render() {
		const portfolios = this.state.portfolios.map(portfolio => (
			<Portfolio
				key={portfolio.fileName}
				portfolio={portfolio}
				showLoginForm={this.state.portfolios.length === 1}
				{...this.props}
			/>
		));

		const portfolioContainer = portfolios.length ? (
			<div className="portfolios">
				<h1>Select Portfolio to Manage</h1>
				<div className="portfolio-item-container">
					{portfolios}
				</div>
			</div>
		) : null;

		return (
			<div className="Login container">
				<CreatePortfolio loadPortfolios={this.loadPortfolios} />
				{portfolioContainer}
			</div>
		);
	}
}
