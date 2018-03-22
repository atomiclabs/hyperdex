/* eslint-disable react/no-access-state-in-setstate */
import {appContainer} from 'containers/App';
import fireEvery from '../fire-every';
import Container from './Container';

class ExchangeContainer extends Container {
	state = {
		baseCurrency: 'CHIPS',
		quoteCurrency: 'KMD',
		activeSwapsView: 'All',
		orderbook: {
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
		this.fetchOrderbook();
	}

	setQuoteCurrency(quoteCurrency) {
		if (quoteCurrency === this.state.baseCurrency) {
			this.setState({baseCurrency: this.state.quoteCurrency});
		}

		this.setState({quoteCurrency});
		this.fetchOrderbook();
	}

	setActiveSwapsView(activeSwapsView) {
		this.setState({activeSwapsView});
	}

	watchOrderbook() {
		if (!this.stopWatchingOrderbook) {
			this.stopWatchingOrderbook = fireEvery(async () => {
				const orderbook = await appContainer.api.orderbook(
					this.state.baseCurrency,
					this.state.quoteCurrency,
				);

				this.setState({orderbook});
			}, 1000);
		}

		return this.stopWatchingOrderbook;
	}
}

const exchangeContainer = new ExchangeContainer();

export default ExchangeContainer;
export {exchangeContainer};
