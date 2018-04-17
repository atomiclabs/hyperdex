import React from 'react';
import {PieChart as Chart, Pie, ResponsiveContainer, Tooltip} from 'recharts';
import appContainer from 'containers/App';
import dashboardContainer from 'containers/Dashboard';
import {formatCurrency} from '../../util';
import './PieChart.scss';

const CustomTooltip = ({payload}) => {
	// It's sometimes empty…
	if (!(payload && payload.length > 0)) {
		return null;
	}

	const [data] = payload;

	return (
		<div className="custom-tooltip">{data.name}: {formatCurrency(data.value)}</div>
	);
};

const PieChart = () => {
	const {state: appState} = appContainer;
	const {currencies} = appState;

	const data = currencies.map(currency => ({
		name: currency.symbol,
		value: currency.cmcBalanceUsd,
	}));

	let PieChart = () => (
		<ResponsiveContainer>
			<Chart>
				<Pie
					data={data}
					dataKey="value"
					isAnimationActive={false}
					innerRadius={90}
					outerRadius={126}
					stroke="#273142"
					strokeWidth={3}
					fill="#3a4778"
				/>
				<Tooltip
					content={<CustomTooltip/>}
				/>
			</Chart>
		</ResponsiveContainer>
	);

	if (dashboardContainer.totalAssetValue === 0) {
		// Recharts shows nothing when empty, so we use a pie chart with only one value
		PieChart = () => (
			<ResponsiveContainer>
				<Chart>
					<Pie
						data={[{value: 1}]}
						isAnimationActive={false}
						innerRadius={90}
						outerRadius={124}
						strokeWidth={0}
						fill="#222c3c"
					/>
				</Chart>
			</ResponsiveContainer>
		);
	}

	return (
		<div className="Dashboard--PieChart">
			<div className="chart-wrapper">
				<PieChart/>
			</div>
			<div className="label">
				<div className="count">
					{dashboardContainer.assetCount}
				</div>
				<div className="total-value">
					{dashboardContainer.totalAssetValueFormatted}
				</div>
			</div>
		</div>
	);
};

export default PieChart;
