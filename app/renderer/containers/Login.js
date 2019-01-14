import {remote} from 'electron';
import {setWindowBounds} from 'electron-util';
import ipc from 'electron-better-ipc';
import {Container} from 'unstated';
import LoginBox from 'views/LoginBox';
import {minWindowSize} from '../../constants';
import {isDevelopment} from '../../util-common';
import Api from '../api';
import SwapDB from '../swap-db';
import appContainer from './App';

const config = remote.require('./config');
const {getPortfolios, decryptSeedPhrase} = remote.require('./portfolio-util');

const setAppWindowBounds = () => {
	const win = remote.getCurrentWindow();
	win.setResizable(true);
	win.setMaximizable(true);
	win.setFullScreenable(true);
	win.setMinimumSize(minWindowSize.width, minWindowSize.height);

	const windowState = config.get('windowState');
	setWindowBounds(windowState);
	const hasPositionState = Reflect.has(windowState, 'x');
	if (!hasPositionState) {
		win.center();
	}
};

const initApi = async seedPhrase => {
	let url = config.get('marketmakerUrl');
	if (url) {
		console.log('Using custom marketmaker URL:', url);
	} else {
		const port = await ipc.callMain('start-marketmaker', seedPhrase);
		url = `http://127.0.0.1:${port}`;
	}

	return new Api({
		endpoint: url,
		seedPhrase,
	});
};

const createApi = async seedPhrase => {
	console.time('create-api');
	const api = await initApi(seedPhrase);
	await api.enableSocket();
	appContainer.api = api;
	if (isDevelopment) {
		// Exposes the API for debugging in DevTools
		// Example: `_api.debug({method: 'portfolio'})`
		window._api = api;
	}

	console.timeEnd('create-api');
	return api;
};

const enableCurrencies = async api => {
	console.time('enable-currencies');
	// ETOMIC needs to be enabled first otherwise ETH/ERC20 tokens will fail
	await api.enableCurrency('ETOMIC');
	await Promise.all(appContainer.state.enabledCoins.map(x => api.enableCurrency(x)));
	console.timeEnd('enable-currencies');
};

const watchFiatPrice = async () => {
	console.time('watch-fiat-price');
	await appContainer.watchFiatPrice();
	console.timeEnd('watch-fiat-price');
};

const watchCurrencies = async () => {
	console.time('watch-currencies');
	await appContainer.watchCurrencies();
	console.timeEnd('watch-currencies');
};

const watchAllCurrencyHistory = async () => {
	console.time('watch-currency-history');
	// We have to use dynamic import here as Webpack is unable to resolve circular
	// dependencies. Better to handle it here so that it's possible to import the
	// App container in the Dashboard container.
	const {default: dashboardContainer} = await import('./Dashboard');
	await dashboardContainer.watchAllCurrencyHistory();
	console.timeEnd('watch-currency-history');
};

class LoginContainer extends Container {
	state = {
		portfolios: null,
		activeView: LoginBox.name,
		selectedPortfolioId: config.get('lastActivePortfolioId'),
		progress: 0,
	};

	constructor() {
		super();
		this.loadPortfolios();
	}

	setActiveView(activeView) {
		this.setState({activeView});
	}

	setProgress(progress) {
		this.setState({progress});
	}

	setSelectedPortfolioId(id) {
		this.setState({selectedPortfolioId: id});
	}

	async loadPortfolios() {
		// We need to do this twice because of the migration of currencies from app config to portfolio.
		// TODO: Remove this when the migration is removed.
		await getPortfolios();

		await this.setState({portfolios: await getPortfolios()});
	}

	portfolioFromId(id) {
		return this.state.portfolios.find(portfolio => portfolio.id === id);
	}

	get selectedPortfolio() {
		return this.portfolioFromId(this.state.selectedPortfolioId);
	}

	async handleLogin(portfolioId, password) {
		console.group('login');
		console.time('login-total');

		console.time('decrypt');
		const portfolio = this.portfolioFromId(portfolioId);
		const seedPhrase = await decryptSeedPhrase(portfolio.encryptedSeedPhrase, password);
		console.timeEnd('decrypt');

		console.time('swap-db');
		const swapDB = new SwapDB(portfolioId, seedPhrase);
		appContainer.swapDB = swapDB;
		if (isDevelopment) {
			window._swapDB = swapDB;
		}

		console.timeEnd('swap-db');

		this.setActiveView('LoggingIn');

		await appContainer.setEnabledCurrencies(portfolio.currencies);

		const api = await createApi(seedPhrase);

		await enableCurrencies(api);

		// Depends on the data from `enableCurrencies()`
		await watchFiatPrice();

		// Depends on the data from `enableCurrencies()` and `watchFiatPrice()`
		await watchCurrencies();

		// Depends on data from `enableCurrencies() and `watchFiatPrice()`
		await watchAllCurrencyHistory();

		config.set('lastActivePortfolioId', portfolio.id);
		setAppWindowBounds();
		appContainer.logIn(portfolio);

		console.timeEnd('login-total');
		console.groupEnd('login');
	}
}

const loginContainer = new LoginContainer();

export default loginContainer;
