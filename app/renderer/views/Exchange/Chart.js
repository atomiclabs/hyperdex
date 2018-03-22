import React from 'react';
import {exchangeContainer} from 'containers/Exchange';
import DepthChart from 'components/DepthChart';
import './Chart.scss';

const Chart = () => {
	const {state} = exchangeContainer;
	const {orderbook} = state;

	return (
		<div className="Exchange--Chart">
			<div className="chart-container">
				<h3>{state.baseCurrency}/{state.quoteCurrency} Depth Chart</h3>
				<DepthChart
					bids={orderbook.bids}
					asks={orderbook.asks}
					bidDepth={orderbook.biddepth}
					askDepth={orderbook.askdepth}
				/>
			</div>
		</div>
	);
};

export default Chart;
