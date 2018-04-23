import {remote} from 'electron';
import {setWindowBounds} from 'electron-util';
import ipc from 'electron-better-ipc';
import {Container} from 'unstated';
import {minWindowSize} from '../../constants';
import Api from '../api';
import appContainer from './App';
import dashboardContainer from './Dashboard';

const config = remote.require('./config');
const {getPortfolios, decryptSeedPhrase} = remote.require('./portfolio-util');

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

const setAppWindowBounds = () => {
	const win = remote.getCurrentWindow();
	win.setResizable(true);
	win.setMaximizable(true);
	win.setFullScreenable(true);
	win.setMinimumSize(minWindowSize.width, minWindowSize.height);
	setWindowBounds(config.get('windowState'));
	win.center(); // TODO: Remove this when `setWindowBounds` handles positioning the window inside the window bounds
};

class LoginContainer extends Container {
	state = {
		portfolios: null,
		activeView: 'LoginBox',
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

	loadPortfolios() {
		return new Promise(async resolve => {
			this.setState({portfolios: await getPortfolios()}, () => {
				resolve();
			});
		});
	}

	portfolioFromId(id) {
		return this.state.portfolios.find(portfolio => portfolio.id === id);
	}

	get selectedPortfolio() {
		return this.portfolioFromId(this.state.selectedPortfolioId);
	}

	async handleLogin(portfolioId, password) {
		const portfolio = this.portfolioFromId(portfolioId);

		// TODO: Show some loading here as it takes some time to decrypt the password and then start marketmaker
		const seedPhrase = await decryptSeedPhrase(portfolio.encryptedSeedPhrase, password);
		const api = await initApi(seedPhrase);
		await api.enableSocket();
		appContainer.api = api;
		// TODO: Uncomment this before we do the public release
		// if (is.development) {
		// 	// Expose the API for debugging in DevTools
		// 	// Example: `_api.debug({method: 'portfolio'})`
		window._api = api;
		// }

		// TODO: These should be changeable by the user
		await Promise.all(config.get('enabledCoins').map(x => api.enableCoin(x)));

		await appContainer.watchCMC();
		await appContainer.watchCurrencies();
		await dashboardContainer.watchCoinCap();

		config.set('lastActivePortfolioId', portfolio.id);

		setAppWindowBounds();

		appContainer.logIn(portfolio);
	}
}

const loginContainer = new LoginContainer();

export default loginContainer;
