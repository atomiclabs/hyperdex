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
		// NOTE: new api
		ordersHistory: [],
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
			// NOTE: new api
			await this.setState({ordersHistory: await this.swapDB.getOrders()});
		};

		setSwapHistory();

		this.swapDB.on('change', setSwapHistory);

		let makerActiveOrders = [];
		let takerActiveOrders = [];

		// TODO: Change this to `1` second.
		fireEvery({seconds: 10}, async () => {
			let activeOrders = this.state.ordersHistory.filter(order => order.isActive || order.status === 'matched').map(order => order.uuid);

			// const orderTypes = this.state.ordersHistory.map(order => order.orderType);
			// console.log('orderTypes', orderTypes);

			// const orderStatus = this.state.ordersHistory.map(order => order.status);
			// console.log('orderStatus', orderStatus);

			console.log(`load recent orders`);
			const myOrders = await this.api.myOrders();
			const takerOrders = myOrders.taker_orders;
			const makerOrders = myOrders.maker_orders;
			const orders = _.merge(takerOrders, makerOrders);
			const activeOrdersInThisLoops = _.keys(orders);
			const makerOrdersInThisLoops = _.keys(makerOrders);
			const takerOrdersInThisLoops = _.keys(takerOrders);

			const ordersJustCompleted = _.differenceWith(activeOrders, activeOrdersInThisLoops, _.isEqual);
			const newOrders = _.differenceWith(activeOrdersInThisLoops, activeOrders, _.isEqual);
			const ordersJustChangeToMaker = _.differenceWith(makerOrdersInThisLoops, makerActiveOrders, _.isEqual);

			// Add new order to loop
			activeOrders = _.concat(activeOrders, newOrders);

			const recentSwaps = await this.api.myRecentSwaps();

			await Promise.all(activeOrders.map(async uuid => {
			try {
				const order = this.state.ordersHistory.find(x => x.uuid === uuid);
				if(!order) {
					console.error('Could not find order:', uuid);
					return;
				}
				const isOrdersJustCompleted = ordersJustCompleted.indexOf(uuid) !== -1;
				const isOrdersJustChangeToMaker = ordersJustChangeToMaker.indexOf(uuid) !== -1;
				let isMakerOrder = order.orderType === "maker";
				let isTakerOrder = order.orderType === "taker";

				// update order type
				if(isOrdersJustChangeToMaker) {
					await this.swapDB.markOrderType(uuid, 'maker');
					isMakerOrder = true;
					isTakerOrder = false;
				}

				// update order swaps
				const orderInMM2 = orders[uuid];
				let activeSwaps = order.startedSwaps;
				if(orderInMM2) {
					// if order is still active, update new swap
	 				activeSwaps = _.concat(activeSwaps, orderInMM2.started_swaps);
				}

				// if(isTakerOrder && isOrdersJustCompleted && order.status !== 'matched') {
				if(isTakerOrder && order.status === 'matched' && activeSwaps.indexOf(uuid) === -1) {
					// taker order just matched and filled
					console.log('isTakerOrder && isOrdersJustCompleted');
					activeSwaps.push(uuid);
				}

				// if(isMakerOrder && isOrdersJustCompleted && order.status !== 'matched') {
				if(isMakerOrder && order.status === 'matched' && order.receivedByMe >= order.requested.baseCurrencyAmount) {
					// maker order just matched and filled
					console.log(`isMakerOrder && matched ${uuid}`);
					// NOTE:
					// because this issue https://github.com/KomodoPlatform/atomicDEX-API/issues/451
					// we only allow user to open one order for each coin pair for now
					// Because there is only one order at a time so all current swaps will be its
					const { baseCurrency, quoteCurrency, orderType } = order;
					for(let i = 0; i < recentSwaps.length; i += 1) {
						const swap = recentSwaps[i];
						const {
							events,
							error_events: errorEvents,
							success_events: successEvents,
						} = swap;

						const failedEvent = events.find(event => errorEvents.includes(event.event.type));
						const isFinished = !failedEvent && events.some(event => event.event.type === 'Finished');

						if(activeSwaps.indexOf(swap.uuid) !== -1) {
							// found last swap, stop loops
							break;
						}

						if(
							swap.my_info.my_coin === quoteCurrency &&
							swap.my_info.other_coin === baseCurrency &&
							swap.type === _.startCase(orderType) &&
							!isFinished
						) {
							activeSwaps.push(swap.uuid);
						}
					}
				}

				if(activeSwaps.length === 0) {
					activeOrders = _.without(activeOrders, uuid);
				}

				const swapsData = activeSwaps
				.map(swapID => recentSwaps.find(x => x.uuid === swapID))
				.filter(el => el); // remove undefined

				if(swapsData.length > 0) {
					await this.swapDB.updateSwapData2(uuid, swapsData);
				}

				// update order status
				if(order.status === 'matched' && order.receivedByMe >= order.requested.baseCurrencyAmount) {
					await this.swapDB.updateOrderStatus(uuid, 'completed');
				}

				if(isOrdersJustCompleted && order.status === 'active') {
					await this.swapDB.updateOrderStatus(uuid, 'matched');
				}
			} catch(err) {
				console.log(err);
			}
			}));

			makerActiveOrders = makerOrdersInThisLoops;
			takerActiveOrders = takerOrdersInThisLoops;
		});

		// TODO: Change this to `1` second.
		fireEvery({seconds: 10}, async () => {
			console.log(`load recent swaps`);
			const uuids = this.state.swapHistory.map(swap => swap.uuid);
			const recentSwaps = await this.api.myRecentSwaps();
			// console.log('recentSwaps', recentSwaps);

			await Promise.all(uuids.map(async uuid => {
				const swap = recentSwaps.find(x => x.uuid === uuid);
				if (!swap) {
					// console.error('Could not find swap:', uuid);
					return;
				}

				// Const errorEvent = swap.events.find(event => swap.error_events.includes(event.type));
				// if (errorEvent) {
				// 	swap.errorEvent = errorEvent;
				// }

				// console.log('swap', swap);

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
			// TODO: Make this 1 second again when mm2 has caching.
			this.stopWatchingCurrencies = await fireEvery({seconds: 5}, async () => {
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
