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
});

class ExchangeContainer extends Container {
	state = getInitialState();

	constructor() {
		super();
		this.setSwapHistory();
		appContainer.getSwapDB.then(swapDB => {
			swapDB.on('change', this.setSwapHistory);
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
}

const exchangeContainer = new ExchangeContainer();

export default exchangeContainer;
