import React from 'react';
import {exchangeContainer} from 'containers/Exchange';
import './Chart.scss';

const Chart = () => {
	const {state} = exchangeContainer;

	return (
		<div className="Exchange--Chart">
			<div className="chart-container">
				<h3>{state.baseCurrency}/{state.quoteCurrency} Depth Chart</h3>
			</div>
		</div>
	);
};

export default Chart;
