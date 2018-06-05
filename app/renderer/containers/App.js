import EventEmitter from 'events';
import electron, {remote} from 'electron';
import ipc from 'electron-better-ipc';
import _ from 'lodash';
import Cycled from 'cycled';
import coinlist from 'coinlist';
import roundTo from 'round-to';
import {Container} from 'unstated';
import {appViews, alwaysEnabledCurrencies} from '../../constants';
import {getCurrencySymbols, getCurrencyName} from '../../marketmaker/supported-currencies';
import fireEvery from '../fire-every';
import {formatCurrency, setLoginWindowBounds} from '../util';
import {isDevelopment} from '../../util-common';

const config = remote.require('./config');

const excludedTestCurrencies = new Set([
	'PIZZA',
	'BEER',
]);

const getTickerData = async symbol => {
	const fallback = {
		symbol,
		price: 0,
	};

	if (excludedTestCurrencies.has(symbol)) {
		return fallback;
	}

	const id = coinlist.get(symbol, 'id');
	if (!id) { // For example, SUPERNET
		return fallback;
	}

	// Docs: https://coinmarketcap.com/api/
	// Example: https://api.coinmarketcap.com/v2/ticker/99/
	let response;
	try {
		response = await fetch(`https://api.coinmarketcap.com/v2/ticker/${id}/`);
	} catch (_) {
		return fallback;
	}

	const json = await response.json();

	if (json.metadata.error) {
		return fallback;
	}

	const {data} = json;
	const quotes = data.quotes.USD;
	return {
		symbol,
		price: quotes.price,
		percentChange24h: quotes.percent_change_24h,
	};
};

class AppContainer extends Container {
	state = {
		activeView: 'Login',
		enabledCoins: _.union(alwaysEnabledCurrencies, config.get('enabledCoins')),
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
					currency.symbol = currency.coin; // For readability

					const {cmcPriceUsd, cmcPercentChange24h} = this.getCurrencyPrice(currency.symbol);

					if (cmcPriceUsd) {
						currency.cmcPriceUsd = cmcPriceUsd;
						currency.cmcBalanceUsd = currency.balance * cmcPriceUsd;
					} else {
						// We handle coins not on CMC
						// `currency.price` is the price of the coin in KMD
						currency.cmcPriceUsd = currency.price * kmdPriceInUsd;
						currency.cmcBalanceUsd = currency.balance * currency.cmcPriceUsd;

						// Don't show price for test currencies
						if (excludedTestCurrencies.has(currency.symbol)) {
							currency.cmcPriceUsd = 0;
							currency.cmcBalanceUsd = 0;
						}
					}

					currency.name = getCurrencyName(currency.symbol);
					currency.cmcPercentChange24h = cmcPercentChange24h;

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

	getCurrencyPrice(symbol) {
		// In the case when we remove a supported currency from
		// the app that the user still has in their swap history
		const fallback = {
			price: 0,
			percentChange24h: 0,
		};

		const {price, percentChange24h} = this.coinPrices.find(x => x.symbol === symbol) || fallback;

		return {
			cmcPriceUsd: price,
			cmcPercentChange24h: percentChange24h,
		};
	}

	enableCurrency(coin) {
		this.setState(prevState => {
			this.api.enableCurrency(coin);
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
		await this.stopMarketmaker();
		config.set('windowState', remote.getCurrentWindow().getBounds());
		this.setActiveView('');
		await Promise.resolve(); // Ensure the window is blank before changing the size
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
