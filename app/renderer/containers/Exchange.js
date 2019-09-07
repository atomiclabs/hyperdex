/* eslint-disable react/no-access-state-in-setstate */
import EventEmitter from 'events';
import _ from 'lodash';
import SuperContainer from 'containers/SuperContainer';
import appContainer from 'containers/App';
import fireEvery from '../fire-every';

class ExchangeContainer extends SuperContainer {
	getInitialState() {
		return {
			baseCurrency: 'CHIPS',
			quoteCurrency: 'KMD',
			activeSwapsView: 'OpenOrders',
			orderBook: {
				bids: [],
				asks: [],
				biddepth: 0,
				askdepth: 0,
			},
			isSendingOrder: false,
		};
	}

	events = new EventEmitter();

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

	setBaseCurrency(baseCurrency) {
		this.events.emit('currency-changed');

		// Switch if the same as `quoteCurrency`
		if (baseCurrency === this.state.quoteCurrency) {
			this.setState({quoteCurrency: this.state.baseCurrency});
		}

		const {orderBook} = this.getInitialState();
		this.setState({baseCurrency, orderBook});
		this.fetchOrderBook();
	}

	setQuoteCurrency(quoteCurrency) {
		this.events.emit('currency-changed');

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
			this.stopWatchingOrderBook = await fireEvery({seconds: 2}, async () => {
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

export default exchangeContainer;
