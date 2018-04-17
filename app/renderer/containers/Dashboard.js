import _ from 'lodash';
import plur from 'plur';
import {Container} from 'unstated';
import appContainer from 'containers/App';
import {formatCurrency} from '../util';
import fireEvery from '../fire-every';

const noPriceHistory = new Set([
	'REVS',
	'SUPERNET',
]);

class DashboardContainer extends Container {
	state = {
		activeView: 'Portfolio',
		currencyHistoryResolution: 'month',
	};

	constructor() {
		super();
		this.currencyHistoryCache = new Map();
	}

	setActiveView = activeView => {
		this.setState({activeView}, () => {
			this.updateCurrencyHistory();
		});
	};

	setCurrencyHistoryResolution = currencyHistoryResolution => {
		this.setState({currencyHistoryResolution}, () => {
			this.updateCurrencyHistory();
		});
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
		const baseUrl = 'http://coincap.io/history/';
		const getUrl = type => `${baseUrl}${type}/${symbol}`;

		switch (this.state.currencyHistoryResolution) {
			case 'hour':
				return getUrl('1day');
			case 'day':
				return getUrl('1day');
			case 'week':
				return getUrl('7day');
			case 'month':
				return getUrl('30day');
			case 'year':
				return getUrl('365day');
			case 'all':
				return `${baseUrl}${symbol}`;
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

		const response = await fetch(this._currencyHistoryUrl);
		const json = await response.json();

		if (!json) {
			noPriceHistory.add(symbol);
			this.setState({currencyHistory: null});
			return;
		}

		// Note: The data gap at the end is a known issue:
		// https://github.com/CoinCapDev/CoinCap.io/issues/120

		const prices = json.price.map(([time, value]) => ({time, value}));
		this.currencyHistoryCache.set(cacheKey, prices);
		this.setState({currencyHistory: prices});
	}

	async watchCoinCap() {
		const FIVE_MINUTES = 1000 * 60 * 5;

		await fireEvery(async () => {
			await this.updateCurrencyHistory();
		}, FIVE_MINUTES);
	}
}

const dashboardContainer = new DashboardContainer();

export default dashboardContainer;
