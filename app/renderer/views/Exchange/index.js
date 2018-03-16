import React from 'react';
import {Subscribe} from 'unstated';
import ExchangeContainer from 'containers/Exchange';
import TabView from 'views/TabView';
import Buy from './Buy';
import Sell from './Sell';
import Chart from './Chart';
import Swaps from './Swaps';
import './Exchange.scss';

const Exchange = () => (
	<Subscribe to={[ExchangeContainer]}>
		{() => (
			<TabView className="Exchange">
				<Buy/>
				<Sell/>
				<Chart/>
				<Swaps/>
			</TabView>
		)}
	</Subscribe>
);

export default Exchange;
