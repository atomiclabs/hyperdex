import React from 'react';
import {ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip} from 'recharts';
import roundTo from 'round-to';
import _ from 'lodash';
import './DepthChart.scss';

const roundPrice = array => array.map(x => ({
	...x,
	price: roundTo(x.price, 8),
}));

const DepthChart = props => {
	let {bids, asks, bidDepth, askDepth} = props;
	const maxDepth = Math.max(bidDepth, askDepth);

	if (!(bids && bids.length > 0)) {
		bids = [{price: 0, depth: 0}];
	}
	if (!(asks && asks.length > 0)) {
		asks = [{price: 0, depth: 0}];
	}

	bids = roundPrice(bids);
	asks = roundPrice(asks);
	bids = _.sortBy(bids, ['price']);
	asks = _.sortBy(asks, ['price']);

	return (
		<div className="DepthChart">
			<ResponsiveContainer width="50%" minHeight={100}>
				<AreaChart data={bids}>
					<Area
						dataKey="depth"
						type="step"
						stroke="#28af60"
						fillOpacity={1}
						fill="#275049"
						isAnimationActive={false}
					/>
					<XAxis
						dataKey="price"
						allowDecimals={false}
						interval="preserveStartEnd"
						axisLine={{
							stroke: '#364357',
							strokeWidth: 2,
						}}
						tickLine={{
							stroke: '#364357',
						}}
						tick={{
							fontSize: '12px',
							fill: '#7f8fa4',
						}}
					/>
					<YAxis
						mirror
						padding={{top: 20}}
						allowDecimals={false}
						interval="preserveEnd"
						scale="linear"
						domain={['dataMin', maxDepth]}
						axisLine={{
							stroke: '#364357',
							strokeWidth: 2,
						}}
						tickLine={{
							stroke: '#808fa3',
						}}
						tick={{
							fontSize: '12px',
							fill: '#7f8fa4',
						}}
					/>
					<Tooltip/>
				</AreaChart>
			</ResponsiveContainer>
			<ResponsiveContainer width="50%" minHeight={100} style={{left: '-10px'}}>
				<AreaChart data={asks}>
					<Area
						dataKey="depth"
						type="step"
						stroke="#f80759"
						fillOpacity={1}
						fill="#5a2947"
						isAnimationActive={false}
					/>
					<XAxis
						dataKey="price"
						allowDecimals={false}
						interval="preserveStartEnd"
						axisLine={{
							stroke: '#364357',
							strokeWidth: 2,
						}}
						tickLine={{
							stroke: '#364357',
						}}
						tick={{
							fontSize: '12px',
							fill: '#7f8fa4',
						}}
					/>
					<YAxis
						mirror
						padding={{top: 20}}
						allowDecimals={false}
						orientation="right"
						scale="linear"
						domain={['dataMin', maxDepth]}
						axisLine={{
							stroke: '#364357',
							strokeWidth: 2,
						}}
						tickLine={{
							stroke: '#808fa3',
						}}
						tick={{
							fontSize: '12px',
							fill: '#7f8fa4',
						}}
					/>
					<Tooltip/>
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
};

export default DepthChart;
