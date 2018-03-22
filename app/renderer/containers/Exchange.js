/* eslint-disable react/no-access-state-in-setstate */
import Container from './Container';

class ExchangeContainer extends Container {
	state = {
		baseCurrency: 'KMD',
		quoteCurrency: 'LTC',
		activeSwapsView: 'All',
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

	// TODO: Temp
	async fetchOrderBook() {
		if (!window.api) {
			return;
		}

		const orderBook = await window.api.orderbook(
			this.state.baseCurrency,
			this.state.quoteCurrency,
		);

		this.setState({orderBook});
	}
}

const exchangeContainer = new ExchangeContainer();

export default ExchangeContainer;
export {exchangeContainer};
