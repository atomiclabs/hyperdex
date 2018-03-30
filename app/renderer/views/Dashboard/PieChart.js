import React from 'react';
import {PieChart as Chart, Pie, Cell, ResponsiveContainer} from 'recharts';
import appContainer from 'containers/App';
import dashboardContainer from 'containers/Dashboard';
import './PieChart.scss';

const PieChart = () => {
	const {state: appState} = appContainer;
	const {currencies} = appState;

	// TODO: Finish the coloring of the correct slices
	const COLORS = [
		'#3a4778',
		'#423a76',
	];

	const data = currencies.map(currency => ({
		name: currency.symbol,
		value: currency.cmcBalanceUsd,
	}));

	return (
		<div className="Dashboard--PieChart">
			<div className="chart-wrapper">
				<ResponsiveContainer>
					<Chart>
						<Pie
							data={data}
							dataKey="value"
							isAnimationActive={false}
							innerRadius={90}
							outerRadius={120}
							fill="#3a4778"
							stroke="none"
						>
							{
								data.map((item, index) => (
									<Cell key={item.name} fill={COLORS[index % COLORS.length]}/>
								))
							}
						</Pie>
					</Chart>
				</ResponsiveContainer>
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
