import _ from 'lodash';
import pMap from 'p-map';
import appContainer from 'containers/App';
import SuperContainer from 'containers/SuperContainer';
import {formatCurrency} from '../util';
import {ignoreExternalPrice} from '../../constants';
import {translate} from '../translate';
import fireEvery from '../fire-every';

const t = translate('dashboard');
const noPriceHistory = new Set();

class DashboardContainer extends SuperContainer {
	state = {
		activeView: 'Portfolio',
		currencyHistoryResolution: 'month',
		listSearchQuery: '',
		portfolioHistory: {
			hour: [],
			day: [],
			week: [],
			month: [],
			year: [],
			all: [],
		},
		currencyHistory: {
			hour: {},
			day: {},
			week: {},
			month: {},
			year: {},
			all: {},
		},
	};

	constructor() {
		super();

		appContainer.events.on('enabled-currencies-changed', () => {
			if (!appContainer.state.enabledCoins.includes(this.activeCurrencySymbol)) {
				this.setActiveView('Portfolio');
			}

			this.updateAllCurrencyHistory();
		});
	}

	setActiveView = async activeView => {
		await this.setState({activeView});
		this.updateCurrencyHistory();
	};

	setCurrencyHistoryResolution = async currencyHistoryResolution => {
		await this.setState({currencyHistoryResolution});

		if (this.state.activeView === 'Portfolio') {
			this.updateAllCurrencyHistory();
		} else {
			this.updateCurrencyHistory();
		}
	};

	setListSearchQuery = listSearchQuery => {
		this.setState({listSearchQuery});
	};

	get assetCount() {
		const {length} = appContainer.state.currencies;
		return `${length} ${t('info.assets', {count: length})}`;
	}

	get totalAssetValue() {
		return _.sumBy(appContainer.state.currencies, 'cmcBalanceUsd');
	}

	get totalAssetValueFormatted() {
		return formatCurrency(this.totalAssetValue);
	}

	get activeCurrencySymbol() {
		return this.state.activeView === 'Portfolio' ? undefined : this.state.activeView;
	}

	get activeCurrency() {
		return appContainer.getCurrency(this.state.activeView);
	}

	_currencyHistoryUrl(symbol) {
		const baseUrl = 'https://min-api.cryptocompare.com/data/';

		const getUrl = (type, limit, aggregate = 1) =>
			`${baseUrl}${type}?fsym=${symbol}&tsym=USD&aggregate=${aggregate}&limit=${limit}&extraParams=HyperDEX`;

		const getUrlForMinutes = (minutes, aggregate) => getUrl('histominute', minutes, aggregate);
		const getUrlForHours = hours => getUrl('histohour', hours);
		const getUrlForDays = (days, aggregate) => getUrl('histoday', days, aggregate);

		switch (this.state.currencyHistoryResolution) {
			case 'hour':
				return getUrlForMinutes(60);
			case 'day':
				return getUrlForMinutes(60 * 24, 10);
			case 'week':
				return getUrlForHours(24 * 7);
			case 'month':
				return getUrlForDays(30);
			case 'year':
				return getUrlForDays(365);
			case 'all':
				return getUrlForDays(100000, 7);
			default:
				throw new Error('Unsupported resolution');
		}
	}

	async fetchPriceHistoryForAllCurrencies() {
		const currencySymbols = appContainer.state.enabledCoins;
		const result = await pMap(currencySymbols, symbol => this.getCurrencyHistory(symbol), {concurrency: 6});
		return _.zipObject(currencySymbols, result);
	}

	calculatePortfolioPriceHistory(currencyHistory) {
		currencyHistory = _.omitBy(currencyHistory, _.isNil);

		const [currencyHistoryFirstValue] = Object.values(currencyHistory);
		if (!currencyHistoryFirstValue) {
			return;
		}

		// We use the first entry just to iterate through the correct amount of items
		const history = currencyHistoryFirstValue.map((currency, index) => {
			let value = 0;
			for (const [currencyKey, currencyValue] of Object.entries(currencyHistory)) {
				const currency = appContainer.getCurrency(currencyKey);
				if (currency) { // Ensures the currency is still enabled
					const price = currencyValue[index].value;
					value += currency.balance * price;
				}
			}

			return {
				time: currency.time,
				value,
			};
		});

		// Don't show the graph if no data
		if (history.every(x => x.value === 0)) {
			return;
		}

		return history;
	}

	async getCurrencyHistory(symbol) {
		if (!symbol) {
			return;
		}

		// We won't even bother to fetch if we know it won't work
		if (ignoreExternalPrice.has(symbol) || noPriceHistory.has(symbol)) {
			return;
		}

		let json;
		try {
			const response = await fetch(this._currencyHistoryUrl(symbol));
			json = await response.json();
		} catch (error) {
			console.error('Failed to get price history:', error);
		}

		if (!json || json.Data.length === 0) {
			noPriceHistory.add(symbol);
			return;
		}

		const prices = json.Data.map(({time, close}) => ({
			time: time * 1000,
			value: close,
		}));

		return prices;
	}

	async updateCurrencyHistory() {
		const symbol = this.activeCurrencySymbol;
		const prices = await this.getCurrencyHistory(symbol);

		this.setState(prevState => {
			prevState.currencyHistory[prevState.currencyHistoryResolution][symbol] = prices;
			return prevState;
		});
	}

	async updateAllCurrencyHistory() {
		const priceHistory = await this.fetchPriceHistoryForAllCurrencies();
		const history = await this.calculatePortfolioPriceHistory(priceHistory);

		await this.setState(prevState => {
			prevState.portfolioHistory[prevState.currencyHistoryResolution] = history;

			// Also set the individual currency history since we got it too
			const currencySymbols = appContainer.state.enabledCoins;
			for (const symbol of currencySymbols) {
				prevState.currencyHistory[prevState.currencyHistoryResolution][symbol] = priceHistory[symbol];
			}

			return prevState;
		});
	}

	async watchCurrencyHistory() {
		await fireEvery({minutes: 3}, async () => {
			await this.updateCurrencyHistory();
		}, {fireInstantly: false});
	}

	async watchAllCurrencyHistory() {
		// We update the active currency more often
		this.watchCurrencyHistory();

		await fireEvery({minutes: 15}, async () => {
			await this.updateAllCurrencyHistory();
		});
	}
}

const dashboardContainer = new DashboardContainer();

export default dashboardContainer;
