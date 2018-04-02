import electron, {remote, ipcRenderer as ipc} from 'electron';
import {is} from 'electron-util';
import _ from 'lodash';
import Cycled from 'cycled';
import coinlist from 'coinlist';
import {appViews} from '../../constants';
import fireEvery from '../fire-every';
import Container from './Container';

const config = remote.require('./config');

const getTickerData = async symbol => {
	const id = coinlist.get(symbol, 'id');
	if (!id) { // For example, SUPERNET
		return {symbol};
	}

	// Docs: https://coinmarketcap.com/api/
	// Example: https://api.coinmarketcap.com/v1/ticker/bitcoin/
	const response = await fetch(`https://api.coinmarketcap.com/v1/ticker/${id}/`);
	const json = await response.json();
	const [data] = json;
	return {
		symbol,
		price: Number.parseFloat(data.price_usd),
	};
};

class AppContainer extends Container {
	state = {
		activeView: 'Login',
	};

	constructor() {
		super();
		this.views = new Cycled(appViews);
		this.enabledCoins = config.get('enabledCoins');
	}

	setActiveView(activeView) {
		this.setState({activeView});
		this.views.index = this.views.indexOf(activeView);
	}

	setNextView() {
		this.setActiveView(this.views.next());
	}

	setPreviousView() {
		this.setActiveView(this.views.previous());
	}

	logIn(portfolio) {
		this.setState({
			activeView: 'Dashboard',
			portfolio,
		});
	}

	async watchCMC() {
		const FIVE_MINUTES = 1000 * 60 * 5;

		await fireEvery(async () => {
			this.coinPrices = await Promise.all(this.enabledCoins.map(symbol => getTickerData(symbol)));
		}, FIVE_MINUTES);
	}

	// TODO: We should use the portfolio socket event instead once it's implemented
	async watchCurrencies() {
		if (!this.stopWatchingCurrencies) {
			this.stopWatchingCurrencies = await fireEvery(async () => {
				const {price: kmdPriceInUsd} = this.coinPrices.find(x => x.symbol === 'KMD');
				let {portfolio: currencies} = await this.api.portfolio();

				// TODO(sindresorhus): Move the returned `mm` currency info to a sub-property and only have cleaned-up top-level properties. For example, `mm` has too many properties for just the balance.

				// Mixin useful data for the currencies
				currencies = currencies.map(currency => {
					const {price} = this.coinPrices.find(x => x.symbol === currency.coin);

					if (price) {
						currency.cmcPriceUsd = price;
						currency.cmcBalanceUsd = currency.balance * price;
					} else {
						// We handle coins not on CMC
						// `currency.price` is the price of the coin in KMD
						currency.cmcPriceUsd = currency.price * kmdPriceInUsd;
						currency.cmcBalanceUsd = currency.balance * currency.cmcPriceUsd;
					}

					currency.symbol = currency.coin; // For readability
					currency.name = coinlist.get(currency.symbol, 'name') || currency.symbol;

					return currency;
				});

				if (!_.isEqual(this.state.currencies, currencies)) {
					this.setState({currencies});
				}
			}, 1000);
		}

		return this.stopWatchingCurrencies;
	}

	getCurrency(symbol) {
		return this.state.currencies.find(x => x.coin === symbol);
	}

	logOut() {
		config.set('windowState', remote.getCurrentWindow().getBounds());

		this.setState({
			activeView: 'Login',
			portfolio: null,
		});

		this.stopMarketmaker();
	}

	async stopMarketmaker() {
		await this.api.stop();
		ipc.send('stop-marketmaker');
	}
}

const appContainer = new AppContainer();

// TODO: The "Log Out" button should be disabled when logged out
ipc.on('log-out', () => {
	appContainer.logOut();
});

ipc.on('set-active-view', (event, view) => {
	appContainer.setActiveView(view);
});

ipc.on('set-next-view', () => {
	appContainer.setNextView();
});

ipc.on('set-previous-view', () => {
	appContainer.setPreviousView();
});

if (is.development) {
	// Expose setState for debugging in DevTools
	window.setState = appContainer.setState.bind(appContainer);
	window.getState = () => appContainer.state;
	window.config = electron.remote.require('./config');
}

function handleDarkMode() {
	const applyDarkMode = () => {
		const darkMode = config.get('darkMode');
		appContainer.setState({darkMode});
		document.documentElement.classList.toggle('dark-mode', darkMode);
	};

	ipc.on('toggle-dark-mode', () => {
		config.set('darkMode', !config.get('darkMode'));
		applyDarkMode();
	});

	applyDarkMode();
}

handleDarkMode();

export default appContainer;
