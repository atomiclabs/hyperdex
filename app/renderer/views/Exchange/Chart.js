import React from 'react';
import {exchangeContainer} from 'containers/Exchange';
import DepthChart from 'components/DepthChart';
import './Chart.scss';

const Chart = () => {
	const {state} = exchangeContainer;
	const {orderBook} = state;

	return (
		<div className="Exchange--Chart">
			<div className="chart-container">
				<h3>{state.baseCurrency}/{state.quoteCurrency} Depth Chart</h3>
				<DepthChart
					bids={orderBook.bids}
					asks={orderBook.asks}
					bidDepth={orderBook.biddepth}
					askDepth={orderBook.askdepth}
				/>
			</div>
		</div>
	);
};

export default Chart;
