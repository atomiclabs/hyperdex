import electron from 'electron';
import React from 'react';
import {Link} from 'react-router-dom';
import {history} from 'react-router-util';
import Blockies from 'react-blockies';
import {If} from 'react-extras';
import Api from '../api';

/* eslint-disable */

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

const initMarketmaker = seedPhrase => new Promise(resolve => {
	electron.ipcRenderer.send('start-marketmaker', {seedPhrase});

	electron.ipcRenderer.on('marketmaker-started', async (event, port) => {
		resolve(`http://localhost:${port}`);
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

class CreatePortfolio extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showPortfolioForm: false,
		};
	}

	showLoginInput() {
		this.setState({
			showPortfolioForm: true,
		});
	}

	async onSubmit(e) {
		e.preventDefault();

		await portfolio.create(this.state);

		// TODO: Fix the routing so this can be removed
		history.push('/');
	}

	render() {

		return (
			<div>
				<button className="add-portfolio btn btn-lg btn-primary btn-block" onClick={this.showLoginInput.bind(this)}>Add portfolio</button>
				<If condition={this.state.showPortfolioForm}>
					<form className="portfolio-form" onSubmit={this.onSubmit.bind(this)}>
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
						<div className="form-group" disabled={this.isCheckingPassword}>
							<button type="submit" className="btn btn-primary btn-sm btn-block">Create</button>
						</div>
					</form>
				</If>
			</div>
		);
	}
}

	class Portfolio extends React.Component {
		constructor(props) {
			super(props);

			this.state = {
				isLoginInputVisible: false,
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

			this.setState({
				isCheckingPassword: true,
				passwordError: null,
			});

			const {encryptedSeedPhrase} = this.props.portfolio;
			const password = this.input.value;

			try {
				// TODO: Show some loading here as it takes some time to decrypt the password and then start marketmaker
				const seedPhrase = await portfolio.decryptSeedPhrase(encryptedSeedPhrase, password);
				this.props.setPortfolio({
					...this.props.portfolio,
					api: await initApi(seedPhrase),
				});

				// TODO: Fix the routing so this can be removed
				history.push('/');
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
				<PortfolioImage seed={portfolio.fileName} bgColor="transparent" onClick={this.showLoginInput.bind(this)} />
				<h4>{portfolio.name}</h4>
				<If condition={this.state.isLoginInputVisible}>
					<form className="login-form" onSubmit={this.onSubmit.bind(this)}>
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
						<If condition={this.state.passwordError} className="form-group">
							<div className="alert alert-danger" role="alert">
								{this.state.passwordError}
							</div>
						</If>
					</form>
				</If>
			</div>
		);
	}
}

export default class Login extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			portfolios: [],
		};

		(async () => {
			this.setState({
				portfolios: await portfolio.getAll(),
			});
		})();
	}

	render() {
		const portfolios = this.state.portfolios.map(portfolio => (
			<Portfolio key={portfolio.fileName} portfolio={portfolio} {...this.props} />
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
				<CreatePortfolio />
				{portfolioContainer}
			</div>
		);
	}
}
