import React from 'react';
import {Subscribe} from 'unstated';
import ExchangeContainer, {exchangeContainer} from 'containers/Exchange';
import TabView from 'views/TabView';
import Order from './Order';
import Chart from './Chart';
import Swaps from './Swaps';
import './Exchange.scss';

const Exchange = () => {
	exchangeContainer.watchOrderBook();

	return (
		<Subscribe to={[ExchangeContainer]}>
			{() => (
				<TabView className="Exchange">
					<Order type="buy"/>
					<Order type="sell"/>
					<Chart/>
					<Swaps/>
				</TabView>
			)}
		</Subscribe>
	);
};

export default Exchange;
