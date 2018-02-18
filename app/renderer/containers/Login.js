import {remote, ipcRenderer as ipc} from 'electron';
import {is} from 'electron-util';
import {Container} from 'unstated';
import Api from '../api';
import {appContainer} from './App';

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

	const api = new Api({
		endpoint: url,
		seedPhrase,
	});

	await api.loadSeed(seedPhrase);

	return api;
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

		if (is.development) {
			// Expose the API for debugging in DevTools
			// Example: `api.debug({method: 'portfolio'})`
			window.api = api;
		}

		// TODO: These should be defaults saved in the config and changeable by the user
		await Promise.all([
			api.enableCoin('KMD'),
			api.enableCoin('VTC'),
			api.enableCoin('LTC'),
		]);

		const {portfolio: currencies} = await api.portfolio();

		config.set('lastActivePortfolioId', portfolio.id);

		// Restore user-preferred window size
		const win = remote.getCurrentWindow();
		const {width, height} = config.get('windowState');
		win.setResizable(true);
		win.setSize(width, height, true);

		appContainer.logIn({
			portfolio,
			currencies,
			api,
		});
	}
}

const loginContainer = new LoginContainer();

export default LoginContainer;
export {loginContainer};
