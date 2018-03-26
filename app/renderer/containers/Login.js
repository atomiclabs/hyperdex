import {remote, ipcRenderer as ipc} from 'electron';
import {is, setWindowBounds} from 'electron-util';
import Api from '../api';
import Container from './Container';
import appContainer from './App';

const config = remote.require('./config');
const {getPortfolios, decryptSeedPhrase} = remote.require('./portfolio-util');

const initMarketmaker = seedPhrase => new Promise(resolve => {
	ipc.send('start-marketmaker', {seedPhrase});

	ipc.on('marketmaker-started', async (event, port) => {
		resolve(`http://127.0.0.1:${port}`);
	});
});

const initApi = async seedPhrase => {
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

const setAppWindowBounds = () => {
	const win = remote.getCurrentWindow();
	win.setResizable(true);
	win.setMaximizable(true);
	win.setFullScreenable(true);
	win.setMinimumSize(760, 500);
	setWindowBounds(config.get('windowState'), {animated: true});
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

	async loadPortfolios() {
		this.setState({portfolios: await getPortfolios()});
	}

	portfolioFromId(id) {
		return this.state.portfolios.find(portfolio => portfolio.id === id);
	}

	get selectedPortfolio() {
		return this.portfolioFromId(this.state.selectedPortfolioId);
	}

	async handleLogin(portfolioId, password) {
		// TODO: Windows can't login yet. Need to find out why.
		if (is.windows) {
			setTimeout(() => {
				location.reload();
			}, 1000);
			return;
		}

		const portfolio = this.portfolioFromId(portfolioId);

		// TODO: Show some loading here as it takes some time to decrypt the password and then start marketmaker
		const seedPhrase = await decryptSeedPhrase(portfolio.encryptedSeedPhrase, password);
		const api = await initApi(seedPhrase);
		await api.enableSocket();
		appContainer.api = api;

		if (is.development) {
			// Expose the API for debugging in DevTools
			// Example: `api.debug({method: 'portfolio'})`
			window.api = api;
		}

		// TODO: These should be defaults saved in the config and changeable by the user
		await Promise.all([
			api.enableCoin('KMD'),
			api.enableCoin('REVS'),
			api.enableCoin('SUPERNET'),
			api.enableCoin('CHIPS'),
			api.enableCoin('BTC'),
			api.enableCoin('VTC'),
			api.enableCoin('LTC'),
		]);

		await appContainer.watchCurrencies();

		config.set('lastActivePortfolioId', portfolio.id);

		setAppWindowBounds();

		appContainer.logIn(portfolio);
	}
}

const loginContainer = new LoginContainer();

export default loginContainer;
