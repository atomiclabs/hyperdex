import {Container} from 'unstated';

class TradesContainer extends Container {
	state = {
		activeView: 'OpenOrders',
	};

	setActiveView = activeView => {
		this.setState({activeView});
	};

	/* eslint-disable no-unused-vars, no-alert */
	cancelSwap = swapUuid => {
		// TODO
		alert('Not yet implemented');
	};
	/* eslint-enable no-unused-vars, no-alert */
}

const tradesContainer = new TradesContainer();

export default tradesContainer;
