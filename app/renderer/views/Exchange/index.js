import React from 'react';
import {Subscribe} from 'unstated';
import exchangeContainer from 'containers/Exchange';
import TabView from 'views/TabView';
import Intro from './Intro';
import Order from './Order';
import Chart from './Chart';
import Swaps from './Swaps';
import './Exchange.scss';

class Exchange extends React.Component {
	constructor() {
		super();
		exchangeContainer.connect(this);
	}

	render() {
		exchangeContainer.watchOrderBook();

		return (
			<Subscribe to={[exchangeContainer]}>
				{() => (
					<React.Fragment>
						<Intro/>
						<TabView className="Exchange">
							<Order type="buy"/>
							<Order type="sell"/>
							<Chart/>
							<Swaps/>
						</TabView>
					</React.Fragment>
				)}
			</Subscribe>
		);
	}
}

export default Exchange;
