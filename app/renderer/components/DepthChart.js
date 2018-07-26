import React from 'react';
import PropTypes from 'prop-types';
import {ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip} from 'recharts';
import roundTo from 'round-to';
import _ from 'lodash';
import Empty from 'components/Empty';
import {translate} from '../translate';
import {formatCurrency} from '../util';
import './DepthChart.scss';

const t = translate('chart');

const roundPrice = array => array.map(x => ({
	...x,
	price: roundTo(x.price, 8),
}));

// TODO(sindresorhus): The default behavior of tooltips is to follow the mouse.
// We should make it static: https://github.com/recharts/recharts/issues/488

const CustomTooltipContent = ({payload}) => {
	// No idea why it's sometimes empty
	if (payload.length === 0) {
		return null;
	}

	return (
		<div className="custom-tooltip">{formatCurrency(payload[0].payload.price)}</div>
	);
};

const DepthChart = props => {
	let {bids, asks} = props;

	const getDepths = orders => orders.map(order => order.depth);
	const maxDepth = Math.max(...getDepths(asks), ...getDepths(bids));
	const isEmpty = bids.length === 0 && asks.length === 0;

	bids = bids.length > 0 ? bids : [{price: 0, depth: 0}];
	asks = asks.length > 0 ? asks : [{price: 0, depth: 0}];
	bids = _.orderBy(bids, ['depth'], ['desc']);
	asks = _.orderBy(asks, ['depth'], ['asc']);
	bids = roundPrice(bids);
	asks = roundPrice(asks);

	const borderColor = 'var(--section-border-color)';

	return (
		<div className={`DepthChart ${isEmpty ? 'is-empty' : ''}`}>
			<ResponsiveContainer width="50%" minHeight={100}>
				<AreaChart data={bids}>
					<Area
						dataKey="depth"
						type="step"
						stroke="var(--depth-chart-buy-stroke-color)"
						fillOpacity={1}
						fill="var(--depth-chart-buy-background-color)"
						isAnimationActive={false}
					/>
					<XAxis
						dataKey="price"
						allowDecimals={false}
						interval="preserveStartEnd"
						axisLine={{
							stroke: borderColor,
							strokeWidth: 2,
						}}
						tickLine={{
							stroke: borderColor,
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
							stroke: borderColor,
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
					<Tooltip
						content={<CustomTooltipContent/>}
						isAnimationActive={false}
						animationDuration={0}
					/>
				</AreaChart>
			</ResponsiveContainer>
			<ResponsiveContainer width="50%" minHeight={100} style={{left: '-10px'}}>
				<AreaChart data={asks}>
					<Area
						dataKey="depth"
						type="step"
						stroke="var(--depth-chart-sell-stroke-color)"
						fillOpacity={1}
						fill="var(--depth-chart-sell-background-color)"
						isAnimationActive={false}
					/>
					<XAxis
						dataKey="price"
						allowDecimals={false}
						interval="preserveStartEnd"
						axisLine={{
							stroke: borderColor,
							strokeWidth: 2,
						}}
						tickLine={{
							stroke: borderColor,
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
							stroke: borderColor,
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
					<Tooltip
						content={<CustomTooltipContent/>}
						isAnimationActive={false}
						animationDuration={0}
					/>
				</AreaChart>
			</ResponsiveContainer>
			<Empty show={isEmpty} text={t('noData')}/>
		</div>
	);
};

DepthChart.propTypes = {
	asks: PropTypes.array,
	bids: PropTypes.array,
};

DepthChart.defaultProps = {
	asks: [],
	bids: [],
};

export default DepthChart;
