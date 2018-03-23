/* eslint-disable react/no-access-state-in-setstate */
import {appContainer} from 'containers/App';
import _ from 'lodash';
import fireEvery from '../fire-every';
import Container from './Container';

class ExchangeContainer extends Container {
	state = {
		baseCurrency: 'CHIPS',
		quoteCurrency: 'KMD',
		activeSwapsView: 'All',
		orderBook: {
			bids: [],
			asks: [],
			biddepth: 0,
			askdepth: 0,
		},
	};

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

export default ExchangeContainer;
export {exchangeContainer};
