import EventEmitter from 'events';
import electron, {remote} from 'electron';
import {is, api, darkMode, activeWindow} from 'electron-util';
import ipc from 'electron-better-ipc';
import _ from 'lodash';
import Cycled from 'cycled';
import roundTo from 'round-to';
import SuperContainer from 'containers/SuperContainer';
/// import {isPast, addHours} from 'date-fns';
import {appViews, alwaysEnabledCurrencies, hiddenCurrencies} from '../../constants';
import {getCurrencyName} from '../../marketmaker/supported-currencies';
import fireEvery from '../fire-every';
import {formatCurrency, setLoginWindowBounds} from '../util';
import fetchCurrencyInfo from '../fetch-currency-info';
import {isDevelopment, isNightlyBuild} from '../../util-common';

const config = remote.require('./config');
const {decryptSeedPhrase, setCurrencies} = remote.require('./portfolio-util');

const excludedTestCurrencies = new Set([
	'MORTY',
	'RICK',
]);

class AppContainer extends SuperContainer {
	state = {
		theme: config.get('theme'),
		activeView: 'Login',
		enabledCoins: alwaysEnabledCurrencies,
		currencies: [],
		swapHistory: [],
	};

	events = new EventEmitter();

	constructor() {
		super();
		this.views = new Cycled(appViews);
		this.setTheme(this.state.theme);
		this.coinPrices = [];

		darkMode.onChange(() => {
			this.setTheme(this.state.theme);
		});
	}

	initSwapHistoryListener() {
		const setSwapHistory = async () => {
			await this.setState({swapHistory: await this.swapDB.getSwaps()});
		};

		setSwapHistory();

		this.swapDB.on('change', setSwapHistory);

		// TODO: Change this to `1` second.
		fireEvery({seconds: 10}, async () => {
			const uuids = this.state.swapHistory.map(swap => swap.uuid);
			const recentSwaps = await this.api.myRecentSwaps();
			console.log('recentSwaps', recentSwaps);

			await Promise.all(uuids.map(async uuid => {
				const swap = recentSwaps.find(x => x.uuid === uuid);
				if (!swap) {
					console.error('Could not find swap:', uuid);
				}

				// Const errorEvent = swap.events.find(event => swap.error_events.includes(event.type));
				// if (errorEvent) {
				// 	swap.errorEvent = errorEvent;
				// }

				console.log('swap', swap);

				// Const status = await this.api.mySwapStatus(uuid);
				// console.log('update', status);
				// TODO: Finish this. It's for tracking swap status.
				// Blocked by https://github.com/artemii235/SuperNET/issues/451
				//
				// We *could* use `my_swap_status` instead of `order_status`, but it's very low-level. Would be nicer to be able to use `order_status`.
				// From Artem: As of now you have to follow these steps: create order -> check order_status -> if there's no order check my_swap_status with same uuid -> if swap is not found there's something unexpected.
				//
				this.swapDB.updateSwapData(swap);
			}));
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

	async setEnabledCurrencies(currencies) {
		currencies = currencies.slice();

		if (isNightlyBuild) {
			currencies.push('RICK', 'MORTY');
		}

		// Force-enable currencies that have active swaps.
		const kickStartCurrencies = await this.api.coinsNeededForKickStart();

		this.setState({
			enabledCoins: _.union(
				alwaysEnabledCurrencies,
				kickStartCurrencies,
				currencies
			),
		});
	}

	setTheme(theme) {
		config.set('theme', theme);

		let cssTheme = theme;
		if (theme === 'system' && is.macos) {
			cssTheme = darkMode.isEnabled ? 'dark' : 'light';
		}

		document.documentElement.dataset.theme = cssTheme;

		this.setState({theme});
	}

	get isDarkTheme() {
		const {theme} = this.state;

		if (theme === 'system' && is.macos) {
			return darkMode.isEnabled;
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
			this.coinPrices = await fetchCurrencyInfo(this.state.enabledCoins);
		});
	}

	// TODO: We should use the portfolio socket event instead once it's implemented
	async watchCurrencies() {
		if (!this.stopWatchingCurrencies) {
			this.stopWatchingCurrencies = await fireEvery({seconds: 1}, async () => {
				const {price: kmdPriceInUsd} = this.coinPrices.find(x => x.symbol === 'KMD');
				const enabledCurrencies = (await this.api.getEnabledCurrencies()).map(x => x.ticker);

				// This imitates the `portfolio` endpoint which is no longer available in mm v2
				let currencies = await Promise.all(enabledCurrencies.map(async currency => {
					const {address, balance} = await this.api.myBalance(currency);

					return {
						coin: currency,
						address,
						balance,
						price: 0, // TODO: No way to get this with mm v2 yet: https://github.com/artemii235/SuperNET/issues/450
					};
				}));

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
			setCurrencies(prevState.portfolio.id, enabledCoins);
			return {enabledCoins};
		}, () => {
			this.events.emit('enabled-currencies-changed');
		});
	}

	disableCoin(coin) {
		this.setState(prevState => {
			this.api.disableCurrency(coin);
			const enabledCoins = prevState.enabledCoins.filter(enabledCoin => enabledCoin !== coin);
			setCurrencies(prevState.portfolio.id, enabledCoins);

			// TODO: Remove this when https://github.com/artemii235/SuperNET/issues/459 is fixed.
			api.dialog.showMessageBox(activeWindow(), {
				message: 'Marketmaker v2 cannot currently disable currencies when running, so you need to restart HyperDEX for it to take effect.',
			});

			return {enabledCoins};
		}, () => {
			this.events.emit('enabled-currencies-changed');
		});
	}

	async logOut(options = {}) {
		await this.stopMarketmaker();
		config.set('windowState', remote.getCurrentWindow().getNormalBounds());
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

ipc.answerMain('current-portfolio-id', () => appContainer.state.portfolio.id);

window.addEventListener('beforeunload', () => {
	ipc.callMain('stop-marketmaker');
});

export default appContainer;
