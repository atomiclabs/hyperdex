import EventEmitter from 'events';
import electron, {remote} from 'electron';
import ipc from 'electron-better-ipc';
import _ from 'lodash';
import Cycled from 'cycled';
import coinlist from 'coinlist';
import roundTo from 'round-to';
import {Container} from 'unstated';
import {appViews} from '../../constants';
import {getCurrencySymbols, getCurrencyName} from '../../marketmaker/supported-currencies';
import fireEvery from '../fire-every';
import {formatCurrency, setLoginWindowBounds} from '../util';
import {isDevelopment} from '../../util-common';

const config = remote.require('./config');

const getTickerData = async symbol => {
	const fallback = {
		symbol,
		price: 0,
	};

	const id = coinlist.get(symbol, 'id');
	if (!id) { // For example, SUPERNET
		return fallback;
	}

	// Docs: https://coinmarketcap.com/api/
	// Example: https://api.coinmarketcap.com/v1/ticker/bitcoin/
	let response;
	try {
		response = await fetch(`https://api.coinmarketcap.com/v1/ticker/${id}/`);
	} catch (_) {
		return fallback;
	}

	const json = await response.json();

	if (json.error) {
		return fallback;
	}

	const [data] = json;
	return {
		symbol,
		price: Number.parseFloat(data.price_usd),
		percentChange24h: data.percent_change_24h,
	};
};

class AppContainer extends Container {
	state = {
		activeView: 'Login',
		enabledCoins: config.get('enabledCoins'),
		currencies: [],
	};

	events = new EventEmitter();

	constructor() {
		super();
		this.views = new Cycled(appViews);

		this.getSwapDB = new Promise(resolve => {
			this.setSwapDB = resolve;
		});
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
			this.coinPrices = await Promise.all(getCurrencySymbols().map(getTickerData));
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
					const {price, percentChange24h} = this.coinPrices.find(x => x.symbol === currency.coin);

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
					currency.name = getCurrencyName(currency.symbol);
					currency.cmcPercentChange24h = percentChange24h;

					currency.balanceFormatted = roundTo(currency.balance, 8);
					currency.cmcPriceUsdFormatted = formatCurrency(currency.cmcPriceUsd);
					currency.cmcBalanceUsdFormatted = formatCurrency(currency.cmcBalanceUsd);

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

	enableCoin(coin) {
		this.setState(prevState => {
			this.api.enableCoin(coin);
			const enabledCoins = [...prevState.enabledCoins, coin];
			config.set('enabledCoins', enabledCoins);
			return {enabledCoins};
		}, () => {
			this.events.emit('enabled-currencies-changed');
		});
	}

	disableCoin(coin) {
		this.setState(prevState => {
			this.api.disableCoin(coin);
			const enabledCoins = prevState.enabledCoins.filter(enabledCoin => enabledCoin !== coin);
			config.set('enabledCoins', enabledCoins);
			return {enabledCoins};
		}, () => {
			this.events.emit('enabled-currencies-changed');
		});
	}

	async logOut() {
		this.stopMarketmaker();
		config.set('windowState', remote.getCurrentWindow().getBounds());
		this.setActiveView('');
		await Promise.resolve();
		setLoginWindowBounds();
		location.reload();
	}

	async stopMarketmaker() {
		await this.api.stop();
		await ipc.callMain('stop-marketmaker');
	}
}

const appContainer = new AppContainer();

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

if (isDevelopment) {
	window._config = electron.remote.require('./config');
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

let prevState = appContainer.state;
appContainer.subscribe(() => {
	// TODO: This can be removed when the update issue is fixed in Electron:
	// https://github.com/electron/electron/issues/12636
	if (appContainer.state.activeView === prevState.activeView) {
		return;
	}

	prevState = appContainer.state;

	ipc.send('app-container-state-updated', appContainer.state);
});

export default appContainer;
