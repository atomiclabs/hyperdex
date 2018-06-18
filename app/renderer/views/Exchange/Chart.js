import React from 'react';
import exchangeContainer from 'containers/Exchange';
import DepthChart from 'components/DepthChart';
import {translate} from '../../translate';
import './Chart.scss';

const t = translate('exchange');

const Chart = () => {
	const {state} = exchangeContainer;
	const {orderBook} = state;

	return (
		<div className="Exchange--Chart">
			<div className="chart-container">
				<h3>
					{t('chart.depth', {
						baseCurrency: state.baseCurrency,
						quoteCurrency: state.quoteCurrency,
					})}
				</h3>
				<DepthChart bids={orderBook.bids} asks={orderBook.asks}/>
			</div>
		</div>
	);
};

export default Chart;
