/* eslint-disable react/no-access-state-in-setstate */
import {appContainer} from 'containers/App';
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

	constructor() {
		super();

		setInterval(() => {
			this.fetchOrderbook();
		}, 1000);
	}

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

	async fetchOrderbook() {
		if (!appContainer.api) {
			return;
		}

		const orderbook = await appContainer.api.orderbook(
			this.state.baseCurrency,
			this.state.quoteCurrency,
		);

		this.setState({orderbook});
	}
}

const exchangeContainer = new ExchangeContainer();

export default ExchangeContainer;
export {exchangeContainer};
