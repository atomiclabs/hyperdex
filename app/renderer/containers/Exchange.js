/* eslint-disable react/no-access-state-in-setstate */
import _ from 'lodash';
import {Container} from 'unstated';
import appContainer from 'containers/App';
import fireEvery from '../fire-every';
import removeOrderBookTimes from '../remove-order-book-times';
import swapDB from '../swap-db';

class SuperDuperContainer extends Container {
	state = {};

	constructor(...args) {
		super(...args);
		this.resetState();
	}

	resetState() {
		if (this.getInitialState) {
			this.state = this.getInitialState();
		}
	}

	connect(component) {
		const originalComponentDidMount = component.componentDidMount.bind(component);
		component.componentDidMount = (...args) => {
			originalComponentDidMount(...args);
			if (this.componentDidMount) {
				this.componentDidMount();
			}
		};

		const originalComponentWillUnmount = component.componentWillUnmount.bind(component);
		component.componentWillUnmount = (...args) => {
			originalComponentWillUnmount(...args);
			if (this.componentWillUnmount) {
				this.componentWillUnmount();
			}
		};
	}
}

class ExchangeContainer extends SuperDuperContainer {
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
		};
	}

	componentDidMount() {
		this.setSwapHistory();
		swapDB.on('change', this.setSwapHistory);
	}

	setSwapHistory = async () => this.setState({swapHistory: await swapDB.getSwaps()});

	setBaseCurrency(baseCurrency) {
		// Switch if the same as `quoteCurrency`
		if (baseCurrency === this.state.quoteCurrency) {
			this.setState({quoteCurrency: this.state.baseCurrency});
		}

		this.setState({baseCurrency});
		this.fetchOrderBook();
	}

	setQuoteCurrency(quoteCurrency) {
		if (quoteCurrency === this.state.baseCurrency) {
			this.setState({baseCurrency: this.state.quoteCurrency});
		}

		this.setState({quoteCurrency});
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

		if (!_.isEqual(removeOrderBookTimes(this.state.orderBook), removeOrderBookTimes(orderBook))) {
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
