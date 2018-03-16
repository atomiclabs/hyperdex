/* eslint-disable react/no-access-state-in-setstate */
import {Container} from 'unstated';

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
	}

	setQuoteCurrency(quoteCurrency) {
		if (quoteCurrency === this.state.baseCurrency) {
			this.setState({baseCurrency: this.state.quoteCurrency});
		}

		this.setState({quoteCurrency});
	}

	setActiveSwapsView(activeSwapsView) {
		this.setState({activeSwapsView});
	}
}

const exchangeContainer = new ExchangeContainer();

export default ExchangeContainer;
export {exchangeContainer};
