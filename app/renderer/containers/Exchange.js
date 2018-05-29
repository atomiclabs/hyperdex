/* eslint-disable react/no-access-state-in-setstate */
import _ from 'lodash';
import {Container} from 'unstated';
import appContainer from 'containers/App';
import fireEvery from '../fire-every';

const getInitialState = () => ({
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
});

class ExchangeContainer extends Container {
	state = getInitialState();

	constructor() {
		super();
		this.setSwapHistory();
		appContainer.getSwapDB.then(swapDB => {
			swapDB.on('change', this.setSwapHistory);
		});

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
		const swapDB = await appContainer.getSwapDB;
		this.setState({swapHistory: await swapDB.getSwaps()});
	};

	setBaseCurrency(baseCurrency) {
		// Switch if the same as `quoteCurrency`
		if (baseCurrency === this.state.quoteCurrency) {
			this.setState({quoteCurrency: this.state.baseCurrency});
		}

		const {orderBook} = getInitialState();
		this.setState({baseCurrency, orderBook});
		this.fetchOrderBook();
	}

	setQuoteCurrency(quoteCurrency) {
		if (quoteCurrency === this.state.baseCurrency) {
			this.setState({baseCurrency: this.state.quoteCurrency});
		}

		const {orderBook} = getInitialState();
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
			this.stopWatchingOrderBook = await fireEvery(async () => {
				await this.fetchOrderBook();
			}, 1000);
		}

		return this.stopWatchingOrderBook;
	}

	setIsSendingOrder = isSendingOrder => {
		this.setState({isSendingOrder});
	};

	isActiveOrderPending = () => {
		// TODO: Remove this when we have Marketmaker v2.
		// Work around Marketmaker's limitation of only one pending swap at the time.
		// Sometimes swaps get stuck in pending mode, so we timeout after one minute.
		const ONE_MINUTE = 1000 * 60;
		const [activeSwap] = this.state.swapHistory;
		const isPending = (
			activeSwap.status === 'pending' &&
			(Date.now() - activeSwap.timeStarted) < ONE_MINUTE
		);

		return this.state.isSendingOrder || isPending;
	};
}

const exchangeContainer = new ExchangeContainer();

export default exchangeContainer;
