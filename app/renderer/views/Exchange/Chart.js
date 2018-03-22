import React from 'react';
import {exchangeContainer} from 'containers/Exchange';
import DepthChart from 'components/DepthChart';
import './Chart.scss';

const bids = [
	{
		price: 46.2131,
		depth: 2000,
	},
	{
		price: 49.34543,
		depth: 1640,
	},
	{
		price: 52.43534,
		depth: 1500,
	},
	{
		price: 55.21363218,
		depth: 1671,
	},
	{
		price: 56.86319039,
		depth: 398.04,
	},
	{
		price: 59.95965677,
		depth: 75.48,
	},
	{
		price: 62.34324,
		depth: 40,
	},
];

const asks = [
	{
		price: 65.24324,
		depth: 30,
	},
	{
		price: 69.86319039,
		depth: 120.14,
	},
	{
		price: 72.95965677,
		depth: 303,
	},
	{
		price: 75.634523,
		depth: 800,
	},
	{
		price: 78.324324,
		depth: 1104,
	},
	{
		price: 81.8657,
		depth: 902,
	},
	{
		price: 84.6575,
		depth: 2006,
	},
];

const Chart = () => {
	const {state} = exchangeContainer;
	const {orderbook} = state;

	if (!orderbook) {
		exchangeContainer.fetchOrderbook();
		return null;
	}

	return (
		<div className="Exchange--Chart">
			<div className="chart-container">
				<h3>{state.baseCurrency}/{state.quoteCurrency} Depth Chart</h3>
				{/*
				<DepthChart
					bids={orderbook.bids}
					asks={orderbook.asks}
					bidDepth={orderbook.biddepth}
					askDepth={orderbook.askdepth}
				/>
				*/}
				<DepthChart
					bids={bids}
					asks={asks}
					bidDepth={2088.75}
					askDepth={2100.43}
				/>
			</div>
		</div>
	);
};

export default Chart;
