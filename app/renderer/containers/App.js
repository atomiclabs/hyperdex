import {remote} from 'electron';
import ipc from 'electron-better-ipc';
import _ from 'lodash';
import Cycled from 'cycled';
import coinlist from 'coinlist';
import roundTo from 'round-to';
import {Container} from 'unstated';
import rootContainer from 'containers/Root';
import loginContainer from 'containers/Login';
import {appViews} from '../../constants';
import fireEvery from '../fire-every';
import {formatCurrency} from '../util';

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
		percentChange24h: data.percent_change_24h,
	};
};

class AppContainer extends Container {
	state = {
		activeView: 'Dashboard',
	};

	constructor() {
		super();
		this.views = new Cycled(appViews);
		this.enabledCoins = config.get('enabledCoins');

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
		rootContainer.setActiveView('App');
		this.setState({
			activeView: 'Dashboard',
			portfolio,
		});
	}

	logOut() {
		rootContainer.setActiveView('Login');
		config.set('windowState', remote.getCurrentWindow().getBounds());

		// TODO(sindresorhus): Temp fix until we support resetting the containers
		loginContainer.setActiveView('LoginBox');
		loginContainer.setProgress(0);

		this.setState({portfolio: null});
		this.stopMarketmaker();
	}

	async stopMarketmaker() {
		await this.api.stop();
		await ipc.callMain('stop-marketmaker');
	}

	getCurrency(symbol) {
		return this.state.currencies.find(x => x.coin === symbol);
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
					currency.name = coinlist.get(currency.symbol, 'name') || currency.symbol;
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
