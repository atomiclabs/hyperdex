/* eslint-disable react/no-access-state-in-setstate */
import {is, api, activeWindow, appLaunchTimestamp} from 'electron-util';
import _ from 'lodash';
import SuperContainer from 'containers/SuperContainer';
import appContainer from 'containers/App';
import {translate} from '../translate';
import fireEvery from '../fire-every';

const t = translate('exchange');

class ExchangeContainer extends SuperContainer {
	getInitialState() {
		return {
			baseCurrency: 'CHIPS',
			quoteCurrency: 'KMD',
			activeSwapsView: 'All',
			swapHistory: [],
			orderBook: {
				bids: [],
				asks: [],
				biddepth: 0,
				askdepth: 0,
			},
			isSendingOrder: false,
		};
	}

	componentDidInitialMount() {
		this.setSwapHistory();
		appContainer.swapDB.on('change', this.setSwapHistory);
	}

	constructor() {
		super();

		appContainer.subscribe(() => {
			if (!appContainer.state.enabledCoins.includes(this.state.baseCurrency)) {
				const newBaseCurrency = appContainer.state.enabledCoins.find(enabledCoin => {
					return enabledCoin !== this.state.quoteCurrency;
				});
				this.setBaseCurrency(newBaseCurrency);
			}
			if (!appContainer.state.enabledCoins.includes(this.state.quoteCurrency)) {
				const newQuoteCurrency = appContainer.state.enabledCoins.find(enabledCoin => {
					return enabledCoin !== this.state.baseCurrency;
				});
				this.setQuoteCurrency(newQuoteCurrency);
			}
		});
	}

	setSwapHistory = async () => {
		this.setState({swapHistory: await appContainer.swapDB.getSwaps()});
	};

	setBaseCurrency(baseCurrency) {
		// Switch if the same as `quoteCurrency`
		if (baseCurrency === this.state.quoteCurrency) {
			this.setState({quoteCurrency: this.state.baseCurrency});
		}

		const {orderBook} = this.getInitialState();
		this.setState({baseCurrency, orderBook});
		this.fetchOrderBook();
	}

	setQuoteCurrency(quoteCurrency) {
		if (quoteCurrency === this.state.baseCurrency) {
			this.setState({baseCurrency: this.state.quoteCurrency});
		}

		const {orderBook} = this.getInitialState();
		this.setState({quoteCurrency, orderBook});
		this.fetchOrderBook();
	}

	setActiveSwapsView(activeSwapsView) {
		this.setState({activeSwapsView});
	}

	async fetchOrderBook() {
		const orderBook = await appContainer.api.orderBook(
			this.state.baseCurrency,
			this.state.quoteCurrency,
		);

		if (
			orderBook.baseCurrency !== this.state.baseCurrency ||
			orderBook.quoteCurrency !== this.state.quoteCurrency
		) {
			return;
		}

		if (!_.isEqual(this.state.orderBook, orderBook)) {
			this.setState({orderBook});
		}
	}

	async watchOrderBook() {
		if (!this.stopWatchingOrderBook) {
			this.stopWatchingOrderBook = await fireEvery({seconds: 1}, async () => {
				await this.fetchOrderBook();
			});
		}

		return this.stopWatchingOrderBook;
	}

	setIsSendingOrder = isSendingOrder => {
		this.setState({isSendingOrder});
	};
}

const exchangeContainer = new ExchangeContainer();

// Warn the user if they try to quit when they have in-progress swaps
window.addEventListener('beforeunload', event => {
	// We never want this annoyance in actual development
	if (is.development) {
		return;
	}

	const hasInProgressSwaps = exchangeContainer.state.swapHistory.find(swap => {
		return swap.timeStarted > appLaunchTimestamp && !['completed', 'failed'].includes(swap.status);
	});

	if (hasInProgressSwaps) {
		event.returnValue = true;

		const selectedButtonIndex = api.dialog.showMessageBox(activeWindow(), {
			type: 'question',
			title: t('confirmQuitTitle'),
			message: t('confirmQuitDescription'),
			buttons: [
				t('quit'),
				t('cancel'),
			],
			defaultId: 0,
			cancelId: 1,
		});

		if (selectedButtonIndex === 0) {
			api.app.exit();
		}
	}
});

export default exchangeContainer;
