import {Container} from 'unstated';

class TradesContainer extends Container {
	state = {
		activeView: 'OpenOrders',
		isSwapCancelling: {},
	};

	setActiveView = activeView => {
		this.setState({activeView});
	};

	setIsSwapCancelling = (swapUuid, isCancelling) => {
		this.setState(state => {
			const {isSwapCancelling} = state;
			isSwapCancelling[swapUuid] = isCancelling;
			return state;
		});
	};
}

const tradesContainer = new TradesContainer();

export default tradesContainer;
