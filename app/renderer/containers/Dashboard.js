import _ from 'lodash';
import plur from 'plur';
import {Container} from 'unstated';
import appContainer from 'containers/App';
import {formatCurrency} from '../util';
import fireEvery from '../fire-every';

const noPriceHistory = new Set([
	'REVS',
	'SUPERNET',
	'PIZZA',
	'BEER',
]);

class DashboardContainer extends Container {
	state = {
		activeView: 'Portfolio',
		currencyHistoryResolution: 'month',
		listSearchQuery: '',
	};

	constructor() {
		super();
		this.currencyHistoryCache = new Map();

		appContainer.subscribe(() => {
			if (!appContainer.state.enabledCoins.includes(this.state.activeView)) {
				this.setActiveView('Portfolio');
			}
		});
	}

	setActiveView = async activeView => {
		await this.setState({activeView});
		this.updateCurrencyHistory();
	};

	setCurrencyHistoryResolution = async currencyHistoryResolution => {
		await this.setState({currencyHistoryResolution});
		this.updateCurrencyHistory();
	};

	setListSearchQuery = listSearchQuery => {
		this.setState({listSearchQuery});
	};

	get assetCount() {
		const {length} = appContainer.state.currencies;
		return `${length} ${plur('asset', length)}`;
	}

	get totalAssetValue() {
		return _.sumBy(appContainer.state.currencies, 'cmcBalanceUsd');
	}

	get totalAssetValueFormatted() {
		return formatCurrency(this.totalAssetValue);
	}

	get activeCurrency() {
		return appContainer.getCurrency(this.state.activeView);
	}

	get _currencyHistoryUrl() {
		const {symbol} = this.activeCurrency;
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

	async updateCurrencyHistory() {
		if (this.state.activeView === 'Portfolio') {
			return;
		}

		const {symbol} = this.activeCurrency;

		// We won't even bother to fetch if we know it won't work
		if (noPriceHistory.has(symbol)) {
			this.setState({currencyHistory: null});
			return;
		}

		// Get it from the cache if available so we can show
		// something right away while we fetch the latest data
		const cacheKey = `${symbol}-${this.state.currencyHistoryResolution}`;
		if (this.currencyHistoryCache.has(cacheKey)) {
			this.setState({currencyHistory: this.currencyHistoryCache.get(cacheKey)});
		}

		let json;
		try {
			const response = await fetch(this._currencyHistoryUrl);
			json = await response.json();
		} catch (error) {
			console.error('Failed to get price history:', error);
		}

		if (!json || json.Data.length === 0) {
			noPriceHistory.add(symbol);
			this.setState({currencyHistory: null});
			return;
		}

		const prices = json.Data.map(({time, close}) => ({
			time: time * 1000,
			value: close,
		}));

		this.currencyHistoryCache.set(cacheKey, prices);
		this.setState({currencyHistory: prices});
	}

	async watchCurrencyHistory() {
		const FIVE_MINUTES = 1000 * 60 * 5;

		await fireEvery(async () => {
			await this.updateCurrencyHistory();
		}, FIVE_MINUTES);
	}
}

const dashboardContainer = new DashboardContainer();

export default dashboardContainer;
