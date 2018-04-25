import {Container} from 'unstated';

class TradesContainer extends Container {
	state = {
		activeView: 'OpenOrders',
	};

	setActiveView = activeView => {
		this.setState({activeView});
	};
}

const tradesContainer = new TradesContainer();

export default tradesContainer;
