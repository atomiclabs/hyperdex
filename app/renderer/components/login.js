import electron from 'electron';
import React from 'react';
import {autoBind} from 'react-extras';
import Api from '../api';
import CreatePortfolioButton from './create-portfolio-button';
import PortfolioItem from './portfolio-item';

/* eslint-disable */

const {getPortfolios, decryptSeedPhrase} = electron.remote.require('./portfolio-util');

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
			portfolios: await getPortfolios(),
		});
	}

	async handleLogin(portfolio, password) {
		// TODO: Show some loading here as it takes some time to decrypt the password and then start marketmaker
		const seedPhrase = await decryptSeedPhrase(portfolio.encryptedSeedPhrase, password);
		const api = await initApi(seedPhrase);

		// TODO: These should be defaults saved in the config and changeable by the user
		await Promise.all([
			api.enableCoin('KMD'),
			api.enableCoin('VTC'),
			api.enableCoin('LTC'),
		]);

		const {portfolio: currencies} = await api.portfolio();

		this.props.setAppState({
			portfolio,
			currencies,
			api
		});
	}

	render() {
		const portfolios = this.state.portfolios.map(portfolio => (
			<PortfolioItem
				key={portfolio.fileName}
				portfolio={portfolio}
				showLoginForm={this.state.portfolios.length === 1}
				handleLogin={this.handleLogin}
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
				<CreatePortfolioButton loadPortfolios={this.loadPortfolios} />
				{portfolioContainer}
			</div>
		);
	}
}
