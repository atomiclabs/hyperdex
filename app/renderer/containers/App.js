import EventEmitter from 'events';
import electron, {remote} from 'electron';
import {is, api} from 'electron-util';
import ipc from 'electron-better-ipc';
import _ from 'lodash';
import Cycled from 'cycled';
import coinlist from 'coinlist';
import roundTo from 'round-to';
import SuperContainer from 'containers/SuperContainer';
import {isPast, addHours} from 'date-fns';
import {appViews, alwaysEnabledCurrencies, ignoreExternalPrice, hiddenCurrencies} from '../../constants';
import {getCurrencyName} from '../../marketmaker/supported-currencies';
import fireEvery from '../fire-every';
import {formatCurrency, setLoginWindowBounds} from '../util';
import {isDevelopment} from '../../util-common';

const config = remote.require('./config');
const {decryptSeedPhrase} = remote.require('./portfolio-util');

const excludedTestCurrencies = new Set([
	'PIZZA',
	'BEER',
]);

const getTickerData = async symbols => {
	const baseURL = 'https://api.coingecko.com/api/v3';

	const filteredSymbols = symbols.filter(symbol => !ignoreExternalPrice.has(symbol));

	const ids = filteredSymbols
		.map(symbol => coinlist.get(symbol, 'id'))
		.filter(symbol => symbol !== undefined); // For example, SUPERNET

	// Docs: https://www.coingecko.com/api/docs/v3#/coins/get_coins_markets
	let data;
	try {
		const response = await fetch(`${baseURL}/coins/markets?vs_currency=usd&ids=${ids.join(',')}`);
		data = await response.json();
	} catch (error) {
		console.error('Failed to fetch from CoinGecko API:', error);
		data = [];
	}

	// The API just ignores IDs it doesn't support, so we need to iterate
	// our list of symbols instead of the result so we can add the fallbacks.
	const currencies = symbols.map(symbol => {
		const currency = data.find(currency => currency.symbol.toUpperCase() === symbol);
		return {
			symbol,
			price: currency ? currency.current_price : 0,
			percentChange24h: currency ? roundTo(Number(currency.price_change_percentage_24h), 1) : 0,
		};
	});

	return currencies;
};

class AppContainer extends SuperContainer {
	state = {
		theme: config.get('theme'),
		activeView: 'Login',
		enabledCoins: _.union(alwaysEnabledCurrencies, config.get('enabledCoins')),
		currencies: [],
		swapHistory: [],
		doneInitialKickstart: false,
	};

	events = new EventEmitter();

	constructor() {
		super();
		this.views = new Cycled(appViews);
		this.setTheme(this.state.theme);
		this.coinPrices = [];
	}

	async kickstartStuckSwaps() {
		const {doneInitialKickstart} = this.state;
		this.state.swapHistory
			.filter(swap => (
				swap.status === 'swapping' &&
				(!doneInitialKickstart || isPast(addHours(swap.timeStarted, 4)))
			))
			.forEach(async swap => {
				const {requestId, quoteId} = swap;
				await this.api.kickstart({requestId, quoteId});
			});

		if (!doneInitialKickstart) {
			await this.setState({doneInitialKickstart: true});
		}
	}

	initSwapHistoryListener() {
		const setSwapHistory = async () => {
			await this.setState({swapHistory: await this.swapDB.getSwaps()});
		};

		setSwapHistory();

		this.swapDB.on('change', setSwapHistory);

		this.api.socket.on('message', message => {
			const uuids = this.state.swapHistory.map(swap => swap.uuid);
			if (uuids.includes(message.uuid)) {
				this.swapDB.updateSwapData(message);
			}
		});

		fireEvery({minutes: 15}, async () => {
			await this.kickstartStuckSwaps();
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

	setTheme(theme) {
		config.set('theme', theme);

		let cssTheme = theme;
		if (theme === 'system' && is.macos) {
			cssTheme = api.systemPreferences.isDarkMode() ? 'dark' : 'light';
		}
		document.documentElement.dataset.theme = cssTheme;

		this.setState({theme});
	}

	get isDarkTheme() {
		const {theme} = this.state;

		if (theme === 'system' && is.macos) {
			return api.systemPreferences.isDarkMode();
		}

		return theme === 'dark';
	}

	logIn(portfolio) {
		this.setState({
			activeView: 'Dashboard',
			portfolio,
		});

		this.initSwapHistoryListener();
	}

	get isLoggedIn() {
		return Boolean(this.state.portfolio);
	}

	getSeedPhrase(password) {
		return decryptSeedPhrase(this.state.portfolio.encryptedSeedPhrase, password);
	}

	updatePortfolio(portfolio) {
		this.setState(state => ({
			portfolio: {
				...state.portfolio,
				...portfolio,
			},
		}));
	}

	async watchFiatPrice() {
		await fireEvery({minutes: 1}, async () => {
			this.coinPrices = await getTickerData(this.state.enabledCoins);
		});
	}

	// TODO: We should use the portfolio socket event instead once it's implemented
	async watchCurrencies() {
		if (!this.stopWatchingCurrencies) {
			this.stopWatchingCurrencies = await fireEvery({seconds: 1}, async () => {
				const {price: kmdPriceInUsd} = this.coinPrices.find(x => x.symbol === 'KMD');
				let {portfolio: currencies} = await this.api.portfolio();

				// TODO(sindresorhus): Move the returned `mm` currency info to a sub-property and only have cleaned-up top-level properties. For example, `mm` has too many properties for just the balance.

				// Mixin useful data for the currencies
				currencies = currencies
					.filter(currency => !hiddenCurrencies.includes(currency.coin))
					.map(currency => {
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
			});
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

	async logOut(options = {}) {
		await this.stopMarketmaker();
		config.set('windowState', remote.getCurrentWindow().getBounds());
		this.setActiveView('');
		this.setState({portfolio: null});
		await Promise.resolve(); // Ensure the window is blank before changing the size
		setLoginWindowBounds();

		// This allows us to show a different view than `Login`` after logging out
		if (options.activeView) {
			ipc.callMain('set-active-view-on-dom-ready', options.activeView);
		}

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
	// This is needed for now as we don't have a good way to flow state up to the main process
	// TODO: In the future we should fix this, but not important now
	if (view === 'Settings' && !appContainer.isLoggedIn) {
		view = 'AppSettings';
	}

	appContainer.setActiveView(view);
});

ipc.on('set-next-view', () => {
	appContainer.setNextView();
});

ipc.on('set-previous-view', () => {
	appContainer.setPreviousView();
});

if (is.macos) {
	api.systemPreferences.subscribeNotification('AppleInterfaceThemeChangedNotification', () => {
		appContainer.setTheme(appContainer.state.theme);
	});
}

if (isDevelopment) {
	window._config = electron.remote.require('./config');
}

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

// We send an initial event so it can show the correct menu state after logging out
ipc.send('app-container-state-updated', appContainer.state);

window.addEventListener('beforeunload', () => {
	ipc.callMain('stop-marketmaker');
});

export default appContainer;
